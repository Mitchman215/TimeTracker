package edu.brown.cs.student.csv;

import edu.brown.cs.student.csv.exceptions.FieldParsingException;
import edu.brown.cs.student.csv.exceptions.MissingFieldException;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Represents an object that parses an array of strings into an object.
 *
 * @param <T> the type that this parser parses data into
 */
@FunctionalInterface
public interface ObjectParser<T> {
  /**
   * Converts a map of field names and field values into an object of type T.
   *
   * @param namedFields a map that associates field names to corresponding datum
   * @return            an object of type T that was constructed from data from the fields
   * @throws MissingFieldException if any of the expected fields are missing from the map
   * @throws FieldParsingException if an error occurs while trying to parse the string values
   *                               into appropriate data types
   */
  T parseObject(Map<String, String> namedFields)
      throws MissingFieldException, FieldParsingException;

  /**
   * Helper function that checks that all the expected fields are present as keys in a map.
   *
   * @param expectedFields a list of the field names used in parsing
   * @param map            a map that has field names as the key corresponding to datum as the value
   * @throws MissingFieldException if any of the expected fields are missing from the map
   */
  static void checkMissingFields(Collection<String> expectedFields, Map<String, String> map)
      throws MissingFieldException {
    List<String> missingFields =  expectedFields.stream()
        .filter(f -> !map.containsKey(f))
        .collect(Collectors.toList());
    if (!missingFields.isEmpty()) {
      throw new MissingFieldException(missingFields);
    }
  }
}
