package edu.brown.cs.student.csv.exceptions;

import java.util.zip.DataFormatException;

/**
 * Thrown to indicate that a parser is fed arguments that have the wrong number of tokens / fields.
 * @see edu.brown.cs.student.csv.CSVDefaultParser
 */
public class WrongNumberOfTokensException extends DataFormatException {

  /**
   * How many tokens the parser expected.
   */
  private final int expectedNumberOfTokens;
  /**
   * How many tokens the parser found in a line.
   */
  private final int actualNumberOfTokens;

  /**
   * Constructs a WrongNumberOfTokensException
   * where a different number of tokens was found as expected.
   *
   * @param expectedNumberOfTokens the number of tokens expected
   * @param actualNumberOfTokens   the number of tokens actually found
   * @throws IllegalArgumentException if the number of expected tokens
   *                                  equals the number of found tokens
   */
  public WrongNumberOfTokensException(int expectedNumberOfTokens, int actualNumberOfTokens) {
    super("Expected " + expectedNumberOfTokens
        + " tokens to parse but found " + actualNumberOfTokens + ".");
    if (expectedNumberOfTokens == actualNumberOfTokens) {
      throw new IllegalArgumentException("Expected number of tokens"
          + " cannot equal actual number of tokens.");
    }
    this.expectedNumberOfTokens = expectedNumberOfTokens;
    this.actualNumberOfTokens = actualNumberOfTokens;
  }

  /**
   * Getter for expectedNumberOfTokens.
   * @return how many tokens the parser expected
   */
  public int getExpectedNumberOfTokens() {
    return expectedNumberOfTokens;
  }

  /**
   * Getter for actualNumberOfTokens.
   * @return how many tokens the parser found
   */
  public int getActualNumberOfTokens() {
    return actualNumberOfTokens;
  }
}
