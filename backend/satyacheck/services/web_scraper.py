"""
Web scraping utilities for extracting content from URLs.
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import logging
from datetime import datetime

logger = logging.getLogger('satyacheck')


class WebScraper:
    """
    Utility class for scraping and parsing web content.
    """
    
    def __init__(self, timeout=10, max_retries=3):
        """
        Initialize scraper.
        
        Args:
            timeout (int): Request timeout in seconds
            max_retries (int): Maximum number of retries
        """
        self.timeout = timeout
        self.max_retries = max_retries
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def scrape_url(self, url):
        """
        Scrape content from URL.
        
        Args:
            url (str): URL to scrape
        
        Returns:
            dict: Scraped content
        """
        try:
            # Fetch the page
            response = requests.get(
                url,
                headers=self.headers,
                timeout=self.timeout,
                verify=True
            )
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract data
            result = {
                'success': True,
                'url': url,
                'domain': urlparse(url).netloc,
                'title': self._extract_title(soup),
                'description': self._extract_description(soup),
                'main_text': self._extract_main_text(soup),
                'authors': self._extract_authors(soup),
                'publish_date': self._extract_publish_date(soup),
                'language': self._detect_language(soup),
                'links': self._extract_links(soup),
                'images': self._extract_images(soup),
            }
            
            return result
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Scraping error for {url}: {str(e)}")
            return {
                'success': False,
                'url': url,
                'error': str(e)
            }
        except Exception as e:
            logger.error(f"Unexpected scraping error: {str(e)}")
            return {
                'success': False,
                'url': url,
                'error': 'Unexpected error during scraping'
            }
    
    @staticmethod
    def _extract_title(soup):
        """Extract page title."""
        title = soup.find('meta', property='og:title')
        if title:
            return title.get('content', '')
        
        title = soup.find('title')
        if title:
            return title.text.strip()
        
        h1 = soup.find('h1')
        if h1:
            return h1.text.strip()
        
        return ''
    
    @staticmethod
    def _extract_description(soup):
        """Extract page description/meta description."""
        description = soup.find('meta', property='og:description')
        if description:
            return description.get('content', '')
        
        description = soup.find('meta', attrs={'name': 'description'})
        if description:
            return description.get('content', '')
        
        return ''
    
    @staticmethod
    def _extract_main_text(soup):
        """Extract main article text."""
        # Remove unwanted elements
        for element in soup(['script', 'style', 'nav', 'footer']):
            element.decompose()
        
        # Try common article containers
        article = soup.find('article')
        if article:
            return article.get_text(separator=' ', strip=True)
        
        main = soup.find('main')
        if main:
            return main.get_text(separator=' ', strip=True)
        
        # Fallback to body
        if soup.find('body'):
            return soup.find('body').get_text(separator=' ', strip=True)
        
        return ''
    
    @staticmethod
    def _extract_authors(soup):
        """Extract article authors."""
        authors = []
        
        # Try meta tags
        author = soup.find('meta', attrs={'name': 'author'})
        if author:
            authors.append(author.get('content', ''))
        
        # Try schema.org
        author_elements = soup.find_all('span', {'itemprop': 'author'})
        for elem in author_elements:
            authors.append(elem.get_text(strip=True))
        
        # Try common author selectors
        author_elements = soup.find_all(['span', 'a'], {'class': ['author', 'by-author']})
        for elem in author_elements[:3]:  # Limit to 3
            text = elem.get_text(strip=True)
            if text and text not in authors:
                authors.append(text)
        
        return list(set(authors))[:5]  # Unique, max 5
    
    @staticmethod
    def _extract_publish_date(soup):
        """Extract publication date."""
        # Try meta tags
        date = soup.find('meta', attrs={'property': 'article:published_time'})
        if date:
            return date.get('content')
        
        date = soup.find('meta', attrs={'name': 'publish_date'})
        if date:
            return date.get('content')
        
        # Try schema.org
        date_elem = soup.find('span', {'itemprop': 'datePublished'})
        if date_elem:
            return date_elem.get('content') or date_elem.get_text(strip=True)
        
        # Try common date selectors
        date_elem = soup.find(['time', 'span'], {'class': ['date', 'published', 'publish-date']})
        if date_elem:
            return date_elem.get_text(strip=True) or date_elem.get('datetime')
        
        return None
    
    @staticmethod
    def _detect_language(soup):
        """Detect content language."""
        # Try html lang attribute
        html = soup.find('html')
        if html and html.get('lang'):
            return html.get('lang', 'en')[:2]
        
        # Try meta tags
        lang = soup.find('meta', attrs={'http-equiv': 'content-language'})
        if lang:
            return lang.get('content', 'en')[:2]
        
        return 'en'
    
    @staticmethod
    def _extract_links(soup):
        """Extract external links."""
        links = []
        
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            if href.startswith('http'):
                links.append(href)
        
        return list(set(links))[:20]  # Unique, max 20
    
    @staticmethod
    def _extract_images(soup):
        """Extract images."""
        images = []
        
        for img in soup.find_all('img', src=True):
            src = img.get('src')
            if src.startswith('http') or src.startswith('/'):
                images.append({
                    'src': src,
                    'alt': img.get('alt', '')
                })
        
        return images[:10]  # Max 10 images


class NewsAggregator:
    """
    Aggregates news from multiple trusted sources.
    """
    
    TRUSTED_SOURCES = [
        'bbc.com',
        'reuters.com',
        'apnews.com',
        'theguardian.com',
        'npr.org',
        'aljazeera.com',
    ]
    
    NEPAL_SOURCES = [
        'setopati.com',
        'ekantipur.com',
        'kantipur.com',
        'myrepublica.com',
        'thehimalayantimes.com',
    ]
    
    @classmethod
    def is_trusted_source(cls, url):
        """Check if URL is from a trusted source."""
        domain = urlparse(url).netloc.lower()
        
        all_sources = cls.TRUSTED_SOURCES + cls.NEPAL_SOURCES
        return any(source in domain for source in all_sources)
    
    @classmethod
    def get_source_credibility(cls, url):
        """Get credibility score for source."""
        domain = urlparse(url).netloc.lower()
        
        # High credibility sources
        high_credibility = ['bbc.com', 'reuters.com', 'apnews.com', 'setopati.com']
        if any(source in domain for source in high_credibility):
            return 80
        
        # Medium credibility
        medium_credibility = ['guardian.com', 'aljazeera.com', 'kantipur.com']
        if any(source in domain for source in medium_credibility):
            return 60
        
        # Default
        return 40


def find_similar_articles(text, max_results=5):
    """
    Find similar articles online.
    This is a simplified implementation.
    
    Args:
        text (str): Text to find similar articles for
        max_results (int): Maximum number of results
    
    Returns:
        list: Similar articles
    """
    # In production, integrate with news APIs
    # (NewsAPI, Google News API, etc.)
    
    return []
