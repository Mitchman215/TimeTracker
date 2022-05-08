package edu.brown.cs.student.repl;

import javax.annotation.Nonnull;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.WeakHashMap;
import java.util.stream.Collectors;

/**
 * Provides temporary storage for any data loaded in and used by commands in the Repl,
 * such as data loaded in with CSV Parsers.
 *
 * <p>While more long term storage is definitely possible,
 * this class is designed with limited short-term storage in mind.</p>
 *
 * @see Repl
 */
public final class LoadedData {

  /**
   * A type-safe heterogeneous container that stores the data loaded in,
   * controlling access through a unique key with a string and type.
   *
   * <p>Each data entry slot (corresponding to each key) can only have one associated type.
   * That type is set whenever data is first loaded in.
   * Once set, it cannot be changed for that key.</p>
   *
   * <p>For commands that only load in a single data set at a time, typically the key should be
   * the name of the command loading in the data. For example, the "stars" command that
   * loads in star data from a single csv file at a time should use a key of "stars".</p>
   */
  private final Map<Key<?>, Object> dataMap;

  /**
   * Creates an empty LoadedData object.
   */
  LoadedData() {
    // weak hash map is used because when there are no longer references to the keys,
    // the data cannot be accessed anymore and thus can be safely deleted
    dataMap = new WeakHashMap<>();
  }

  /**
   * Loads data into this LoadedData with an explicit type designated with a string key.
   * The explicit type is allowed to be a super class of the actual type of the data.
   *
   * <p>Note: As the code is, non-reifiable types (like {@code List<String>}) aren't completely
   * type-safe. Java's does not have type literals specifically for these types.
   * Therefore, data slots that store objects with parameterized types cannot
   * differentiate between different parameterized types (i.e. you can store both a
   * {@code List<String>} and {@code List<Integer>} in the same slot interchangeably).
   * Maybe fix this in the future by expanding the Key class. </p>
   *
   * @param key  the string component of the key used to access the data
   * @param type the explicit type to be associated with the key / data entry slot
   * @param data the data to be loaded into this object
   * @param <T>  the type of the data currently being stored
   * @return     a new typed key object that can be used to access the data
   * @throws IllegalStateException if the data entry slot corresponding to the key
   *                               already is associated to a different type
   */
  public <T> Key<T> loadData(String key, Class<T> type,
                             T data) throws IllegalStateException {
    Objects.requireNonNull(type);
    Objects.requireNonNull(key);
    var existingKey = getTypedKey(key);
    if (existingKey.isEmpty()) {
      // key doesn't exist yet, create one and store the data
      var typedKey = new Key<>(key, type);
      dataMap.put(typedKey, type.cast(data));
      return typedKey;
    } else {
      // key already exists, check that types match and store the data
      if (existingKey.get().storedType.equals(type)) {
        dataMap.put(existingKey.get(), data);
        // This cast is safe because we checked that the types are the same
        @SuppressWarnings("unchecked") var typedKey = (Key<T>) existingKey.get();
        return typedKey;
      } else {
        throw new IllegalStateException("A different type is already set to this key");
      }
    }
  }

  /**
   * Loads data into the dataMap using a typed key object directly.
   *
   * @param key  the typed key to use to load the data
   * @param data the data to be stored into the dataMap
   * @param <T>  the type of the data to be stored.
   * @return     the key used to store and access the data
   */
  public <T> Key<T> loadData(Key<T> key, T data) {
    return loadData(key.stringKey, key.storedType, data);
  }

  /**
   * Retrieves data loaded in with the specified key.
   * The data will automatically be cast to the type of the key.
   *
   * @param typedKey the typed Key used to access the data
   * @param <T>      the type of the data
   * @return         an optional containing any data stored at the key.
   *                 If there isn't any data stored, returns an empty optional instead.
   */
  public <T> Optional<T> getDataOptional(Key<T> typedKey) {
    Object requestedData = dataMap.get(typedKey);
    Class<T> type = typedKey.storedType;
    return Optional.ofNullable(type.cast(requestedData));
  }

  /**
   * Retrieves data loaded in with the specified key.
   * The data will automatically be cast to the type of the key.
   *
   * @param typedKey the key used to access the data
   * @param <T>      the type of the data
   * @return         the data stored with the key, or null if there is no data stored
   */
  public <T> T getData(Key<T> typedKey) {
    var optional = getDataOptional(typedKey);
    if (optional.isEmpty()) {
      return null;
    } else {
      return optional.get();
    }
  }

  /**
   * Finds the typed Key uniquely associated with a particular string key.
   *
   * @param strKey the string key
   * @return       the associated DataEntryKey if it has been created,
   *               otherwise returns an empty optional.
   */
  public Optional<Key<?>> getTypedKey(String strKey) {
    var matchingKeys = dataMap.keySet()
        .stream()
        .filter(k -> strKey.equals(k.stringKey))
        .collect(Collectors.toList());
    assert matchingKeys.size() <= 1 : "Key \"" + strKey + "\" is not unique";
    if (matchingKeys.isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(matchingKeys.get(0));
  }

  /**
   * Class for storing string keys to data and the corresponding type of the data.
   *
   * @param <T> the type of data being stored at the corresponding key position
   */
  public static final class Key<T> {

    /**
     * The string key used to identify the data.
     */
    @Nonnull
    private final String stringKey;

    /**
     * The type of the data stored at the key entry.
     */
    @Nonnull
    private final Class<T> storedType;

    /**
     * Creates a new Key.
     *
     * @param stringKey  the string component of the key
     * @param storedType the type of the key, corresponding to the type of data stored
     */
    public Key(String stringKey, Class<T> storedType) {
      this.stringKey = stringKey;
      this.storedType = storedType;
    }

    // Only considers the string component of the key when comparing equality
    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }
      Key<?> that = (Key<?>) o;
      return stringKey.equals(that.stringKey);
    }

    // only hashes the string component of the key when comparing equality
    @Override
    public int hashCode() {
      return Objects.hash(stringKey);
    }
  }
}
