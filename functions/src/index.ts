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

type WeeklyAverage = {
  start: Timestamp;
  finish: Timestamp;
  average: number;
};

type MonthlyAverage = {
  month: string;
  average: number;
};

type ClassDoc = {
  class: CollectionReference<DocumentData>;
  name: string;
  daily_averages: DailyAverage[];
  weekly_averages: WeeklyAverage[];
  monthly_averages: MonthlyAverage[];
};

// whenever a user creates, update the average
// for the corresponding day.
export const createRecord = functions.firestore
  .document("users/{userId}/records/{recordId}")
  .onCreate(async (snap, context) => {
    const record = snap.data() as Record;

    // find the corresponding existing class average data
    const classDocRef = await admin
      .firestore()
      .doc(`users/${context.params.userId}/classes/${record.class.id}`)
      .get();

    // if no class average data exists, create a new object
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
          weekly_averages: [],
          monthly_averages: [],
        });
      return;
    }

    // else, get the data
    const classDocData = classDocRef.data() as ClassDoc;

    // find the day corresponding to this new record and add to the average
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

    // if no day exists, add it to the list
    classDocData.daily_averages.push({
      day: record.start,
      average: record.duration,
    });

    // sort the list by the most recent days
    classDocData.daily_averages.sort((day1, day2) => {
      return -1 * day1.day.valueOf().localeCompare(day2.day.valueOf());
    });

    // then only return the most recent 7 days
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

    // since this is updating a record assume that the data exists
    const classDocData = classDocRef.data() as ClassDoc;

    let added = false;
    let removeIndex = -1;
    for (let i = 0; i < classDocData.daily_averages.length; i++) {
      const curAvg = classDocData.daily_averages[i];

      // if the day of a record was changed, subtract from the average of
      // that day
      if (
        curAvg.day.toDate().toDateString() ==
        beforeRecord.start.toDate().toDateString()
      ) {
        curAvg.average -= beforeRecord.duration;

        // if that was the only record from that day, prime it
        // to be removed from the recent averages list
        if (curAvg.average == 0) {
          removeIndex = i;
        }
      }

      // add to the average of the day the record was changed to
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

    // if the day it was changed to already exists, just update the average
    if (added) {
      await classDocRef.ref.update({
        daily_averages: classDocData.daily_averages,
      });
      return;
    }

    // if the day it was changed to doesn't already exist,
    // do the same addition, sorting, and splicing as the
    // creation function
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

        // if this was the only record for the day,
        // prime the daily average to be removed
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

// when a user deletes a class, delete all of that user's records for that class
export const deleteClass = functions.firestore
  .document("users/{userId}/classes/{classId}")
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;
    const classId = context.params.classId;

    // get all of a users' records for that class
    const recordsToDelete = await admin.firestore()
      .collection(`users/${userId}/records`)
      .where("class_name", "==", classId)
      .get();

    // delete each record
    recordsToDelete.forEach((doc) => {
      doc.ref.delete();
    });
  });

// at the beginning of every week update all the weekly everages
exports.updateWeeklyAvgs = functions.pubsub
  .schedule("59 23 * * 0")
  .timeZone("America/New_York")
  .onRun(async () => {
    const endOfWeek = admin.firestore.Timestamp.fromDate(new Date());
    const beginningOfWeek = admin.firestore.Timestamp.fromDate(
      new Date(new Date().setDate(new Date().getDate() - 7))
    );

    const usersSnap = await admin.firestore().collection("users").get();

    // for each user calcualte their average time per class
    for (let i = 0; i < usersSnap.docs.length; i++) {
      const classesSnap = await admin
        .firestore()
        .collection(`users/${usersSnap.docs[i].id}/classes`)
        .get();

      // for each class they have records for
      for (let j = 0; j < classesSnap.docs.length; j++) {
        const classDocData = classesSnap.docs[i].data() as ClassDoc;

        // get all the records from this week for the current class
        const weeklyRecords = await admin
          .firestore()
          .collection(`users/${usersSnap.docs[i].id}/records`)
          .where("start", ">=", beginningOfWeek)
          .where("start", "<=", endOfWeek)
          .where("class", "==", classDocData.class)
          .get();

        // sum all the record
        const total = weeklyRecords.docs.reduce((sum, record) => {
          const recordData = record.data() as Record;
          return sum + recordData.duration;
        }, 0);

        // add this week to the weekly averages
        classDocData.weekly_averages.push({
          start: beginningOfWeek,
          finish: endOfWeek,
          average: total,
        });

        // update (make sure to only keep 4 most recent weeks)
        await classesSnap.docs[i].ref.update({
          weekly_averages: classDocData.weekly_averages.slice(0, 4),
        });
      }
    }
  });

// at the beginning of every week update all the weekly everages
exports.updateMonthlyAvgs = functions.pubsub
  .schedule("0 0 1 * *")
  .timeZone("America/New_York")
  .onRun(async () => {
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));

    const beginningOfMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1
    );

    const endOfMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0
    );

    const lastMonthName = lastMonth.toLocaleString("default", {
      month: "long",
    });

    const usersSnap = await admin.firestore().collection("users").get();
    for (let i = 0; i < usersSnap.docs.length; i++) {
      const classesSnap = await admin
        .firestore()
        .collection(`users/${usersSnap.docs[i].id}/classes`)
        .get();

      // for each class they have records for
      for (let j = 0; j < classesSnap.docs.length; j++) {
        const classDocData = classesSnap.docs[i].data() as ClassDoc;

        // get all the records from this week for the current class this month
        const monthlyRecords = await admin
          .firestore()
          .collection(`users/${usersSnap.docs[i].id}/records`)
          .where("start", ">=", beginningOfMonth)
          .where("start", "<=", endOfMonth)
          .where("class", "==", classDocData.class)
          .get();

        // sum all the records
        const total = monthlyRecords.docs.reduce((sum, record) => {
          const recordData = record.data() as Record;
          return sum + recordData.duration;
        }, 0);

        // add this week to the monthly averages
        classDocData.monthly_averages.push({
          month: lastMonthName,
          average: total,
        });

        // update (make sure to only keep 4 most recent months)
        await classesSnap.docs[i].ref.update({
          monthly_averages: classDocData.monthly_averages.slice(0, 4),
        });
      }
    }
  });
