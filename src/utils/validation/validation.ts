/**
 * Validation utility functions for the Weather Dashboard
 */

/**
 * Validates a city name input
 * 
 * @param cityName - The city name string to validate
 * @returns true if the city name is valid (contains at least one non-whitespace character), false otherwise
 * 
 * @example
 * validateCityName("London") // returns true
 * validateCityName("  ") // returns false
 * validateCityName("") // returns false
 * validateCityName("New York") // returns true
 */
export function validateCityName(cityName: string): boolean {
  return cityName.trim().length > 0;
}
