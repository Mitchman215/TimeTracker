package edu.brown.cs.student.csv;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.DataFormatException;

/**
 * An object that is used to parse a line of a CSV file into an object with type T.
 *
 * @param <T> the type of object produced by this CSVParser
 */
public interface CSVParser<T> {

  /**
   * Splits a line from a CSV file into a list of tokens (represented as strings)
   * based on delimiters, which are by default commas and quotes.
   * Usually, this method is created with a call to CSVParser.createStringSplitter.
   *
   * @param line a line in a csv file
   * @return     a list of substrings that represent the tokens on the inputted line.
   */
  default List<String> splitLine(String line) {
    return DEFAULT_SPLITTER.apply(line);
  }

  /**
   * Parses a line in a CSV file.
   *
   * @param line the line of input from the CSV file
   * @return     an object of type T that represents the data on that line.
   * @throws DataFormatException if the CSV file isn't formatted correctly. Possible sources include
   *                             missing an expected field, having an inconsistent number of tokens
   *                             per line, or failure to parse a specific field.
   */
  T parseLine(String line) throws DataFormatException;

  /**
   * Creates a function used to split a string into a list of substrings
   * based on a primary and a secondary delimiter.
   *
   * Primary delimiters are given the highest preference in splitting the string, such that if
   * a secondary delimiter is enclosed between two primary delimiters, the secondary delimiter
   * will not affect the splitting.
   * For example, if the primary delimiter is "'" and the secondary is "\\s" (regex for whitespace),
   * then the input string "first 'list of things'  last thing" will be split as
   * ["first", "list of things", "last", "thing"].
   * Note: be careful how java formats strings and use escape characters if necessary.
   * For example, to pass in double quotes as a delimiter, the literal argument should be "\""
   *
   * Regex adapted from the following article:
   * https://gist.github.com/awwsmm/886ac0ce0cef517ad7092915f708175f
   * @param primaryDelim   the primary delimiter to split the string on in regex.
   * @param secondaryDelim the secondary delimiter to split the string on in regex.
   * @param keepPrimary    if true, the function will keep primaryDelimiters in the output
   * @return               a function that splits an input string based on the primary and
   *                       secondary delimiters according to the rules outlined above
   */
  static Function<String, List<String>> createStringSplitter(
      String primaryDelim, String secondaryDelim, boolean keepPrimary) {
    // Creates a pattern used for splitting tokens by the delimiters
    String splittingRegex = buildRegex(primaryDelim, secondaryDelim);
    Pattern splittingPattern = Pattern.compile(splittingRegex);
    // Creates a pattern for tokens enclosed in primary delimiters
    String enclosedInPrimaryRegex = primaryDelim + "(.*?)" + primaryDelim;
    Pattern enclosedPattern = Pattern.compile(enclosedInPrimaryRegex);

    return (str) -> {
      // workaround to handle the case if string begins with secondary delimiter
      if (str.matches(secondaryDelim + "(.*?)")) {
        str = "\"\"" + str;
      }
      List<String> result = new ArrayList<>();
      Matcher regexSplitter = splittingPattern.matcher(str);
      while (regexSplitter.find()) {
        String match = regexSplitter.group(1);
        Matcher enclosedMatcher = enclosedPattern.matcher(match);
        if (!keepPrimary && enclosedMatcher.matches()) {
          result.add(enclosedMatcher.group(1));
        } else {
          result.add(match);
        }
      }
      return result;
    };
  }

  /**
   * Overloaded version of createStringSplitter that automatically sets keepPrimary to false.
   *
   * @param primaryDelim   the primary delimiter to split the string on in regex.
   * @param secondaryDelim the secondary delimiter to split the string on in regex.
   * @return               a function that splits an input string based on the primary and
   *                       secondary delimiters according to the rules outlined above
   */
  static Function<String, List<String>> createStringSplitter(
      String primaryDelim, String secondaryDelim) {
    return createStringSplitter(primaryDelim, secondaryDelim, false);
  }

  /**
   * Helper function for createStringSplitter that creates the regex for splitting appropriately.
   * Regex was adapted from the following article (also has an explanation of the regex):
   * https://gist.github.com/awwsmm/886ac0ce0cef517ad7092915f708175f
   *
   * @param primary   the primary delimiter to split the string on in regex.
   * @param secondary the secondary delimiter to split the string on in regex.
   * @return          a regular expression that will split strings correctly.
   */
  private static String buildRegex(String primary, String secondary) {
    // Complete regex string with default delimiters:
    // "(?:,|\\n|^)(\"(?:(?:\"\")*[^\"]*)*\"|[^\",\\n]*|(?:\\n|$))"
    String firstGroup = "(?:" + secondary + "|\\n|^)";

    String firstOption = "(" + primary + "(?:(?:" + primary
        + primary + ")*[^" + primary + "]*)*" + primary;
    String secondOption = "|[^" + primary + secondary + "\\n]*";
    String thirdOption = "|(?:\\n|$))";

    return firstGroup
        + firstOption
        + secondOption
        + thirdOption;
  }

  /**
   * Quotes are the default enclosing regex found in most CSV files.
   */
  String DEFAULT_ENCLOSING_REGEX = "\"";

  /**
   * Commas are the default separating regex found in most CSV files.
   */
  String DEFAULT_SEPARATING_REGEX = ",";

  /**
   * The default way of splitting lines of CSV files using quotes and commas.
   */
  Function<String, List<String>> DEFAULT_SPLITTER =
      createStringSplitter(DEFAULT_ENCLOSING_REGEX, DEFAULT_SEPARATING_REGEX);
}
