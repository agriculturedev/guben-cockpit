/**
 * Utility function to get the appropriate image for an event
 * It returns the event's image if available, otherwise returns a category image,
 * or a fallback image if no category image is found
 */
/**
 * Utility function to get the appropriate image for an event
 * It returns the event's image if available, otherwise returns a category image,
 * or a fallback image if no category image is found
 */
export function getEventImage(category?: string | null): string | null {
  // If the event has a category, try to use a category image
  if (category) {
    // Normalize the category string:
    // 1. Convert to lowercase
    // 2. Replace umlauts and special characters
    // 3. Remove spaces and slashes
    const normalizedCategory = category
      .toLowerCase()
      // Replace German umlauts and special characters
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[äÄ]/g, 'ae')
      .replace(/[öÖ]/g, 'oe')
      .replace(/[üÜ]/g, 'ue')
      .replace(/[ß]/g, 'ss')
      // Remove spaces, slashes and other special characters
      .replace(/[\s\/\\]+/g, '')
      .replace(',', '')
      // Remove any remaining non-alphanumeric characters
      .replace(/[^a-z0-9-]/g, '');

    console.log(normalizedCategory);

    const categoryImagePath = `/images/categories/${normalizedCategory}.png`;

    return categoryImagePath;
  }

  // Fallback to a default image if no category is available
  return null;
}
