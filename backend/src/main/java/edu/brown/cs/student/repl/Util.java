package edu.brown.cs.student.repl;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Houses utility functions
public class Util {
  
  // private constructor to ensure this class is non-instantiable
  private Util() { }

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
}
