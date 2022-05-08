package edu.brown.cs.student.repl;

/**
 * A command that has access to the state of the Repl it's in through access to the Repl's memory.
 */
public abstract class StateCommand implements Command {

  /**
   * The Repl that the command is for.
   */
  private final Repl repl;

  /**
   * The Repl's memory.
   */
  private final LoadedData memory;

  /**
   * Create a new StateCommand associated with a Repl.
   *
   * @param repl the repl that the command is for
   */
  public StateCommand(Repl repl) {
    this.repl = repl;
    this.memory = repl.getMemory();
  }

  /**
   * Getter that facilitates access to the Repl's memory.
   *
   * @return a reference to the Repl's memory
   */
  public final LoadedData getMemory() {
    return memory;
  }

}
