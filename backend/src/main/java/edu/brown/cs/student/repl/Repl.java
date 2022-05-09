package edu.brown.cs.student.repl;

import java.io.InputStream;
import java.io.PrintStream;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Nonnull;

/**
 * A non-instantiable command-line style REPL (read-eval-print loop).
 * Users can execute commands with arguments from standard input.
 *
 * To add new commands to the repl, append the command name and command object
 * to the `ALL_COMMANDS` map.
 */
public final class Repl {

  /**
   * The stream where the user will enter in commands and their arguments.
   */
  @Nonnull
  private final InputStream inputSource;

  /**
   * The stream to where output from the commands will be printed.
   */
  @Nonnull
  private final PrintStream outputDestination;

  /**
   * Maps the name the user uses to call a command to the actual command object.
   */
  @Nonnull
  private final Map<String, Command> availableCommands;

  /**
   * Data loaded into the repl.
   */
  @Nonnull
  private final LoadedData memory;

  /**
   * Core commands that come with all Repls.
   */
  private static final List<Command> CORE_COMMANDS = List.of(
      Echo.INSTANCE);

  /**
   * Create a new repl with the specified input stream, print stream, and commands.
   *
   * @param inputSource       the stream that commands and arguments will be entered into
   *                          in order to run
   * @param outputDestination the stream to which output is sent
   * @param commands          the commands to add to the repl initially
   */
  // TODO make it so constructor automatically connects repl memory with StateCommands
  public Repl(InputStream inputSource,
              PrintStream outputDestination,
              Collection<Command> commands) {
    this.inputSource = inputSource;
    this.outputDestination = outputDestination;
    this.memory = new LoadedData();
    availableCommands = Stream.concat(CORE_COMMANDS.stream(), commands.stream())
        .collect(Collectors.toMap(Command::getName, cmd -> cmd));
  }

  /**
   * Creates a Repl with only core commands.
   * that accepts input from standard input ({@code System.in})
   * and sends output to standard output ({@code System.out})
   */
  public Repl() {
    this(System.in, System.out, List.of());
  }

  /**
   * Creates a Repl with the passed in commands and the core commands.
   * that accepts input from standard input ({@code System.in})
   * and sends output to standard output ({@code System.out})
   *
   * @param commands a collection of commands to be used in the new Repl
   */
  public Repl(Collection<Command> commands) {
    this(System.in, System.out, commands);
  }

  /**
   * Starts the REPL, allowing the user to execute the available commands.
   */
  public void start() {
    try (BufferedReader in = new BufferedReader(new InputStreamReader(inputSource))) {
      String input = in.readLine();
      while (input != null) {
        String output = processInput(input);
        if (output != null && !output.equals("")) {
          outputDestination.println(output);
        }
        input = in.readLine();
      }
    } catch (IOException e) {
      System.out.println("ERROR: problem with receiving input: " + e.getMessage());
    } catch (IllegalArgumentException e) {
      System.out.println("ERROR: " + e.getMessage());
    }
  }

  /**
   * Adds a command to the repl, allowing users to call the command.
   * Commands must have unique names. This method will not add commands whose names
   * are already taken by another command in the repl.
   *
   * @param command the command to add to the repl
   * @return        true if the command was added successfully, false if not
   */
  public boolean addCommand(Command command) {
    if (availableCommands.containsKey(command.getName())) {
      return false;
    } else {
      availableCommands.put(command.getName(), command);
      return true;
    }
  }

  /**
   * Getter for this Repl's memory.
   *
   * @return this Repl's memory
   */
  public LoadedData getMemory() {
    return memory;
  }

  /**
   * Creates a new commandBundle and executes it.
   * (This method makes testing CommandBundle possible)
   *
   * @param input user input with a command and appropriate arguments separated by spaces
   * @return      the output from running the command or an error message
   */
  String processInput(String input) {
    try {
      CommandBundle cb = new CommandBundle(input);
      return cb.runCommand();
    } catch (IllegalArgumentException e) {
      return "ERROR: " + e.getMessage();
    }
  }

  /**
   * An internal class for representing commands bundled with their arguments.
   */
  private final class CommandBundle {
    /**
     * The command.
     */
    private final Command command;

    /**
     * The arguments for the command.
     */
    private final String[] arguments;

    /**
     * Memberwise constructor for creating CommandBundles.
     *
     * @param command a non-null command object
     * @param args the arguments for the associated command
     */
    CommandBundle(Command command, String[] args) {
      this.command = command;
      this.arguments = args;
    }

    /**
     * Splits a line of user input based on spaces and quotes, keeping the quotes in the output.
     *
     * @param input the input to be split
     * @return      a list of substrings representing the distinct tokens in the input
     */
    private List<String> splitUserInput(String input) {
      return Util.createStringSplitter("\"", "[\\s]+", true)
          .apply(input);
    }

    /**
     * Create a CommandBundle object from raw user input to the repl.
     *
     * @param userInput a space-separated string with a valid command
     *                  followed by the desired arguments.
     *                  Valid commands are keys in the `ALL_COMMANDS` map.
     * @throws IllegalArgumentException if no input was entered or the entered input does not
     *                                  correspond to any commands in `ALL_COMMANDS`
     */
    CommandBundle(String userInput) throws IllegalArgumentException {
      if (userInput == null || userInput.matches("[\\s]*")) {
        throw new IllegalArgumentException("No command or arguments entered");
      }
      List<String> matchList = splitUserInput(userInput);

      if (matchList.size() < 1) {
        throw new IllegalArgumentException("No command or arguments entered");
      }
      String commandName = matchList.get(0);
      matchList.remove(0);
      Command c = availableCommands.get(commandName);
      if (c == null) {
        throw new IllegalArgumentException("Unknown command: \"" + commandName + "\"");
      }
      command = c;
      arguments = matchList.toArray(new String[0]);
    }

    /**
     * Runs the stored command and returns the result or an error message.
     *
     * @return the string output from running the command.
     */
    public String runCommand() {
      try {
        return command.execute(arguments);
      } catch (IllegalArgumentException e) {
        return "ERROR: Incorrect use of " + command.getName()
            + ". Expected usage: " + command.getUsage()
            + ". " + (e.getMessage() == null ? "" : e.getMessage());
      }
    }
  }
}
