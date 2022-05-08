package edu.brown.cs.student.csv;

import edu.brown.cs.student.csv.exceptions.WrongNumberOfTokensException;

import java.util.List;
import java.util.function.Function;

/**
 * A CSVParser that creates a list of the string tokens for each line of a CSV file.
 */
public final class CSVDefaultParser implements CSVParser<List<String>> {

  /**
   * The function used to split each line of a CSV file into tokens.
   */
  private final Function<String, List<String>> lineSplitter;

  /**
   * Internal count of the number of expected tokens per line. Is set after the first line is
   * parsed, and is used to ensure that CSV files have a consistent number of tokens per line.
   */
  private int numTokensPerLine = -1;

  /**
   * Creates a new CSVDefaultParser that splits lines according to the custom regex
   * for the encloser (primary delimiter) and the separator (secondary delimiter).
   * Look at {@link CSVParser}'s createStringSplitter function for more details.
   *
   * @param enclosingRegex   the regex to be matched as the primary delimiter for splitting lines
   * @param separatingRegex  the regex to be matched as the secondary delimiter for splitting lines
   */
  public CSVDefaultParser(String enclosingRegex, String separatingRegex) {
    this.lineSplitter = CSVParser.createStringSplitter(enclosingRegex, separatingRegex);
  }

  /**
   * Creates a new CSVDefaultParser that splits lines on double quotes (") and commas (,).
   */
  public CSVDefaultParser() {
    this.lineSplitter = CSVParser.DEFAULT_SPLITTER;
  }

  @Override
  public List<String> splitLine(String line) {
    return lineSplitter.apply(line);
  }

  @Override
  public List<String> parseLine(String line) throws WrongNumberOfTokensException {
    List<String> tokens = splitLine(line);
    if (numTokensPerLine == -1) {
      numTokensPerLine = tokens.size();
    } else if (numTokensPerLine != tokens.size()) {
      throw new WrongNumberOfTokensException(numTokensPerLine, tokens.size());
    }

    return tokens;
  }

}
