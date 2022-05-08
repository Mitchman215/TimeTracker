package edu.brown.cs.student.csv.exceptions;

import java.util.Arrays;
import java.util.Collection;
import java.util.zip.DataFormatException;

/**
 * Thrown if a parser was expecting certain fields, but they were not found.
 * @see edu.brown.cs.student.csv.ObjectParser
 */
public class MissingFieldException extends DataFormatException {

  /**
   * The names of the fields that are missing. Can be empty
   */
  private final String[] missingFields;

  /**
   * Creates a MissingFieldException with the specified missing fields.
   *
   * @param missingFields the name(s) of the missing fields that the parser was expecting
   */
  public MissingFieldException(String... missingFields) {
    super("The following field(s) were missing from input: "
        + Arrays.toString(missingFields) + ".");
    this.missingFields = missingFields;
  }

  /**
   * Creates a MissingFieldException with the specified missing fields.
   *
   * @param missingFields the name(s) of the missing fields that the parser was expecting as a list
   */
  public MissingFieldException(Collection<String> missingFields) {
    this(missingFields.toArray(new String[0]));
  }

  /**
   * Getter for missingFields.
   * @return the names of the fields that are missing. Can be empty
   */
  public String[] getMissingFields() {
    return missingFields;
  }
}
