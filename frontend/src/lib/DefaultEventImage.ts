/**
 * Utility function to get the appropriate image for an event
 * It returns the event's image if available, otherwise returns a category image,
 * or a fallback image if no category image is found
 */
export function getEventImage(category?: string | null): string | null {
  // If the event has a category, try to use a category image
  if (category) {
    // Convert category to lowercase and remove spaces and slashes to match filename format
    const normalizedCategory = category.toLowerCase().replace(/[\s\/\\]+/g, '');
    const categoryImagePath = `/images/categories/${normalizedCategory}.png`;

    // Note: We can't check if the file exists on the client side easily
    // So we return the path and let the image component handle the fallback if needed
    return categoryImagePath;
  }

  // Fallback to a default image if no category is available
  return null;
}
