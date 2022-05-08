package edu.brown.cs.student.csv.exceptions;

import javax.annotation.Nullable;
import java.util.zip.DataFormatException;

/**
 * Thrown when a CSVReader encounters unexpected formatting while reading a CSV file.
 * Is usually thrown from a command that reads CSV data.
 * @see edu.brown.cs.student.csv.CSVReader
 */
public class CSVFileFormatException extends DataFormatException {

  /**
   * The line number where the formatting error occurred.
   */
  private final int lineNumber;

  /**
   * The path to the CSV file with the improper formatting, if it is known.
   */
  @Nullable private String filePath;

  /**
   * Creates a CSVFileFormatException given information about where the file formatting occurred.
   *
   * @param lineNumber the line number that the error occurred.
   * @param filePath   the path to the CSV file where the error occurred.
   * @param cause      the cause (can be null, indicating a nonexistent or unknown cause).
   */
  public CSVFileFormatException(int lineNumber, @Nullable String filePath,
                                @Nullable Throwable cause) {
    initCause(cause);
    this.filePath = filePath;
    this.lineNumber = lineNumber;
  }

  /**
   * Creates a CSVFileFormatException given information about where the file formatting occurred.
   *
   * @param lineNumber the line number that the error occurred.
   * @param filePath   the path to the CSV file where the error occurred.
   * @param details    a string describing the cause of the file formatting error.
   */
  public CSVFileFormatException(int lineNumber, @Nullable String filePath, String details) {
    super(details);
    this.filePath = filePath;
    this.lineNumber = lineNumber;
  }

  @Override
  public String getMessage() {
    StringBuilder errorMessage = new StringBuilder();
    if (getCause() != null) {
      errorMessage.append(getCause().getMessage());
    } else if (super.getMessage() != null) {
      errorMessage.append(super.getMessage());
    }
    errorMessage.append(" Occurred while reading line #").append(lineNumber);
    if (filePath != null) {
      errorMessage.append(" of the file at ").append(filePath).append(".");
    } else {
      errorMessage.append(".");
    }
    return errorMessage.toString();
  }

  /**
   * Getter for filePath.
   * @return the path to the CSV file with the improper formatting, if it is known.
   */
  @Nullable
  public String getFilePath() {
    return filePath;
  }

  /**
   * Getter for lineNumber.
   * @return the line number where the formatting error occurred.
   */
  public int getLineNumber() {
    return lineNumber;
  }

  /**
   * Setter for filePath. Allows the filePath to be set after the exception is created.
   * @param path the path to the CSV file with the improper formatting, if it is known.
   * @return     this CSVFileFormatException
   */
  public CSVFileFormatException setFilePath(@Nullable String path) {
    this.filePath = path;
    return this;
  }
}
