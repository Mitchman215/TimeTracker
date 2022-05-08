package edu.brown.cs.student.csv.exceptions;

import java.util.zip.DataFormatException;

/**
 * An exception for when an input string cannot be converted into the value for a field.
 * @see edu.brown.cs.student.csv.ObjectParser
 */
public class FieldParsingException extends DataFormatException {

  /**
   * The name of the field that the value cannot be parsed into.
   */
  private final String fieldName;

  /**
   * The value that can't be parsed into the field.
   */
  private final String invalidValue;

  /**
   * Constructs a FieldParsingException for the specified field, value, and cause.
   *
   * @param fieldName    the name of the field that the value cannot be parsed into
   * @param invalidValue the value that can't be parsed into the field
   * @param cause        the cause (null value indicates unknown or nonexistent cause)
   */
  public FieldParsingException(String fieldName, String invalidValue, Throwable cause) {
    super(createErrorMessage(fieldName, invalidValue));
    initCause(cause);
    this.fieldName = fieldName;
    this.invalidValue = invalidValue;
  }

  /**
   * Constructs a FieldParsingException for the specified field and value and an unknown cause.
   *
   * @param fieldName    the name of the field that the value cannot be parsed into
   * @param invalidValue the value that can't be parsed into the field
   */
  public FieldParsingException(String fieldName, String invalidValue) {
    this(fieldName, invalidValue, null);
  }

  private static String createErrorMessage(String fieldName, String invalidValue) {
    return "\"" + invalidValue + "\" cannot be parsed into the field \""
        + fieldName + "\".";
  }

  /**
   * Getter for fieldName.
   * @return the field that the value cannot be parsed into
   */
  public String getFieldName() {
    return fieldName;
  }

  /**
   * Getter for invalidValue.
   * @return the value that caused the exception
   */
  public String getInvalidValue() {
    return invalidValue;
  }
}
