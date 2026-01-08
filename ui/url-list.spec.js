import { renderUrlList } from './url-list.js'
import { it, beforeEach, afterEach, vi, expect } from 'vitest'
import { screen } from '@testing-library/dom'

let urlList;

beforeEach(() => {
  // Set up a mock DOM environment for each test
  document.body.innerHTML = `
    <ul id="url-list"></ul>
  `;
  urlList = document.getElementById('url-list');
  // Mock the throw new Error call inside the url-list.js
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Clean up the DOM after each test
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

it('should display a list of urls and highlight the active one', () => {
  const urls = ['http://example.com/page1', 'http://example.com/page2'];
  const activeUrl = 'http://example.com/page2';

  renderUrlList(urls, activeUrl);

  // Assert that the list items are rendered
  const listItems = screen.getAllByRole('listitem');
  expect(listItems).toHaveLength(2);

  // Assert content of the first link
  const link1 = screen.getByRole('link', { name: 'http://example.com/page1' });
  expect(link1).toHaveAttribute('href', 'http://example.com/page1');
  expect(link1).not.toHaveClass('green-dot'); // Ensure no green dot for inactive URL

  // Assert content of the second link (active URL)
  const link2 = screen.getByRole('link', { name: 'http://example.com/page2' });
  expect(link2).toHaveAttribute('href', 'http://example.com/page2');
  
  // Check for the green dot specifically
  const activeListItem = link2.closest('li');
  expect(activeListItem).toBeInTheDocument();
  const greenDot = activeListItem.querySelector('.green-dot');
  expect(greenDot).toBeInTheDocument();
});

