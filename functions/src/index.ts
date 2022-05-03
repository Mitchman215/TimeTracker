import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  Timestamp,
  CollectionReference,
  DocumentData,
} from "@google-cloud/firestore";

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
type Record = {
  start: Timestamp;
  finish: Timestamp;
  duration: number;
  class: CollectionReference<DocumentData>;
};

type DailyAverage = {
  day: Timestamp;
  average: number;
};

type ClassDoc = {
  class: CollectionReference<DocumentData>;
  name: string;
  daily_averages: DailyAverage[];
};

// whenever a user creates, update the average
// for the corresponding day.
export const createRecord = functions.firestore
  .document("users/{userId}/records/{recordId}")
  .onCreate(async (snap, context) => {
    const record = snap.data() as Record;

    // const startOfDay = record.start.toDate().setHours(0, 0, 0, 0);
    // const endOfDay = new Date(startOfDay).setHours(23, 59, 59, 999);
    const classDocRef = await admin
      .firestore()
      .doc(`users/${context.params.userId}/classes/${record.class.id}`)
      .get();

    if (!classDocRef.exists) {
      await admin
        .firestore()
        .doc(`users/${context.params.userId}/classes/${record.class.id}`)
        .create({
          class: record.class,
          name: record.class.id,
          daily_averages: [
            {
              day: record.start,
              average: record.duration,
            },
          ],
        });
      return;
    }

    const classDocData = classDocRef.data() as ClassDoc;

    for (let i = 0; i < classDocData.daily_averages.length; i++) {
      const curAvg = classDocData.daily_averages[i];

      if (
        curAvg.day.toDate().toDateString() ==
        record.start.toDate().toDateString()
      ) {
        curAvg.average += record.duration;
        await classDocRef.ref.update({
          daily_averages: classDocData.daily_averages,
        });
        return;
      }
    }

    classDocData.daily_averages.push({
      day: record.start,
      average: record.duration,
    });

    classDocData.daily_averages.sort((day1, day2) => {
      return -1 * day1.day.valueOf().localeCompare(day2.day.valueOf());
    });

    await classDocRef.ref.update({
      daily_averages: classDocData.daily_averages.slice(0, 7),
    });
    return;
  });

export const updateRecord = functions.firestore
  .document("users/{userId}/records/{recordId}")
  .onUpdate(async (change, context) => {
    const afterRecord = change.after.data() as Record;
    const beforeRecord = change.before.data() as Record;

    const classDocRef = await admin
      .firestore()
      .doc(`users/${context.params.userId}/classes/${afterRecord.class.id}`)
      .get();

    const classDocData = classDocRef.data() as ClassDoc;

    let added = false;
    let removeIndex = -1;
    for (let i = 0; i < classDocData.daily_averages.length; i++) {
      const curAvg = classDocData.daily_averages[i];

      if (
        curAvg.day.toDate().toDateString() ==
        beforeRecord.start.toDate().toDateString()
      ) {
        curAvg.average -= beforeRecord.duration;

        if (curAvg.average == 0) {
          removeIndex = i;
        }
      }

      if (
        curAvg.day.toDate().toDateString() ==
        afterRecord.start.toDate().toDateString()
      ) {
        curAvg.average += beforeRecord.duration;
        added = true;
      }
    }

    if (removeIndex > -1) {
      classDocData.daily_averages.splice(removeIndex, 1);
    }

    if (added) {
      await classDocRef.ref.update({
        daily_averages: classDocData.daily_averages,
      });
      return;
    }

    classDocData.daily_averages.push({
      day: afterRecord.start,
      average: afterRecord.duration,
    });

    classDocData.daily_averages.sort((day1, day2) => {
      return -1 * day1.day.valueOf().localeCompare(day2.day.valueOf());
    });

    await classDocRef.ref.update({
      daily_averages: classDocData.daily_averages.slice(0, 7),
    });

    return;
  });

export const deleteRecord = functions.firestore
  .document("users/{userId}/records/{recordId}")
  .onDelete(async (snap, context) => {
    const record = snap.data() as Record;

    const classDocRef = await admin
      .firestore()
      .doc(`users/${context.params.userId}/classes/${record.class.id}`)
      .get();

    const classDocData = classDocRef.data() as ClassDoc;

    let removeIndex = -1;
    for (let i = 0; i < classDocData.daily_averages.length; i++) {
      const curAvg = classDocData.daily_averages[i];

      if (
        curAvg.day.toDate().toDateString() ==
        record.start.toDate().toDateString()
      ) {
        curAvg.average -= record.duration;

        if (curAvg.average == 0) {
          removeIndex = i;
        }
      }
    }

    if (removeIndex > -1) {
      classDocData.daily_averages.splice(removeIndex, 1);
    }

    await classDocRef.ref.update({
      daily_averages: classDocData.daily_averages,
    });
  });
