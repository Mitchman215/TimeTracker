package edu.brown.cs.student.repl;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import org.junit.Test;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

public class LoadedDataTest {

  @Test
  public void testLoadData() {
    LoadedData memory = new LoadedData();
    var resultKey =
        memory.loadData("key", List.class, List.of(1, 2));
    var expectedKey = new LoadedData.Key<>("key", List.class);
    assertEquals(expectedKey, resultKey);
  }

  @Test
  public void testLoadDataWithSuperType() {
    LoadedData memory = new LoadedData();
    var resultKey =
        memory.loadData("key", List.class, new ArrayList<Integer>());
    var expectedKey = new LoadedData.Key<>("key", List.class);
    assertEquals(resultKey, expectedKey);
  }

  @Test
  public void testLoadDataWithExistingKey() {
    LoadedData memory = new LoadedData();
    var resultKey =
        memory.loadData("key", List.class, new ArrayList<>(List.of(1)));
    var secondResultKey =
        memory.loadData("key", List.class, new ArrayList<>(List.of(9)));
    var expectedKey = new LoadedData.Key<>("key", List.class);
    assertEquals(resultKey, secondResultKey);
    assertEquals(expectedKey, resultKey);

    // make sure you can't load data with same string key but different explicit type
    assertThrows("A different type is already set to this key",
        IllegalStateException.class,
        () -> memory.loadData("key", Integer.class, 20));

    // still doesn't work even if explicit type is subclass
    assertThrows("A different type is already set to this key",
        IllegalStateException.class,
        () -> memory.loadData("key", ArrayList.class, new ArrayList<>(List.of(2))));
  }

  @Test
  public void testLoadDataWithDifferentSubclasses() {
    LoadedData memory = new LoadedData();
    var resultKey =
        memory.loadData("key", List.class, new ArrayList<>(List.of(1)));
    var secondResultKey =
        memory.loadData("key", List.class, new LinkedList<>(List.of(9)));
    var expectedKey = new LoadedData.Key<>("key", List.class);
    assertEquals(resultKey, secondResultKey);
    assertEquals(expectedKey, resultKey);
  }

  @Test
  public void testGetData() {
    LoadedData memory = new LoadedData();
    var resultKey =
        memory.loadData("key", Integer.class, 1);
    assertEquals(Optional.of(1), memory.getDataOptional(resultKey));
  }

  @Test
  public void testGetDataInvalidKey() {
    LoadedData memory = new LoadedData();
    memory.loadData("key", Integer.class, 1);
    var invalidKey = new LoadedData.Key<>("ERROR", Integer.class);
    assertEquals(Optional.empty(), memory.getDataOptional(invalidKey));
  }

  @Test
  public void testDataOverwrite() {
    LoadedData memory = new LoadedData();
    var resultKey =
        memory.loadData("key", String.class, "HELLO");
    assertEquals(Optional.of("HELLO"), memory.getDataOptional(resultKey));
    // make sure data isn't overwrriten after first get
    assertEquals(Optional.of("HELLO"), memory.getDataOptional(resultKey));

    // overwrite the data
    memory.loadData("key", String.class, "NEW");
    assertEquals(Optional.of("NEW"), memory.getDataOptional(resultKey));
  }
}
