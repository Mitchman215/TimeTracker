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

type UserClassDoc = {
  class: CollectionReference<DocumentData>;
  name: string;
  daily_averages: DailyAverage[];
  weekly_averages: WeeklyAverage[];
  monthly_averages: MonthlyAverage[];
};

type ClassDoc = {
  name: string;
  course_number: string;
  department: string;
  daily_average: number;
  num_days: number;
  weekly_average: number;
  num_weeks: number;
  total_time: number;
};

type DepartmentDoc = {
  name: string;
  daily_average: number;
  num_days: number;
  weekly_average: number;
  num_weeks: number;
  total_time: number;
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
    const classDocData = classDocRef.data() as UserClassDoc;

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
    const classDocData = classDocRef.data() as UserClassDoc;

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

    const classDocData = classDocRef.data() as UserClassDoc;

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
    const recordsToDelete = await admin
      .firestore()
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
        const classDocData = classesSnap.docs[j].data() as UserClassDoc;

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
        classDocData.weekly_averages?.push({
          start: beginningOfWeek,
          finish: endOfWeek,
          average: total,
        });

        // update (make sure to only keep 4 most recent weeks)
        await classesSnap.docs[j].ref.update({
          weekly_averages: classDocData.weekly_averages.slice(0, 4),
        });
      }
    }

    // now calculate the averages for classes
    const classesSnap = await admin.firestore().collection("classes").get();
    const classesWeeklyTotals: { [key: string]: number } = {};
    for (let i = 0; i < classesSnap.docs.length; i++) {
      const classDoc = classesSnap.docs[i];

      // get all the records associated with the current class from this week
      const classRecordsSnap = await admin
        .firestore()
        .collectionGroup("records")
        .where("start", ">=", beginningOfWeek)
        .where("start", "<=", endOfWeek)
        .where("class", "==", classDoc.ref)
        .get();

      let weekTotal = 0;
      const users: Set<string> = new Set<string>();
      for (let j = 0; j < classRecordsSnap.docs.length; j++) {
        const recordDocData = classRecordsSnap.docs[i].data() as Record;
        weekTotal += recordDocData.duration;
        const userId = classRecordsSnap.docs[j].ref.parent.parent?.id as string;
        users.add(userId);
      }

      // get the average amount of time per user for this week
      const weekAvg = weekTotal > 0 ? weekTotal / users.size : 0;
      classesWeeklyTotals[classDoc.id] = weekAvg;

      const classDocData = classDoc.data() as ClassDoc;
      // add the total average user time for this week
      classDocData.total_time = classDocData.total_time || 0;
      classDocData.total_time += weekAvg;

      // update the number of weeks and then re-calculate the average
      classDocData.num_weeks = classDocData.num_weeks || 0;
      classDocData.num_weeks += 1;
      classDocData.weekly_average =
        classDocData.total_time / classDocData.num_weeks;

      // update the number of days then re-calculate the average
      classDocData.num_days = classDocData.num_days || 0;
      classDocData.num_days += 7;
      classDocData.daily_average =
        classDocData.total_time / classDocData.num_days;

      await classDoc.ref.update(classDocData);
    }

    // lastly now calculate averages for the departments
    const departmentsSnap = await admin
      .firestore()
      .collection("departments")
      .get();
    for (let i = 0; i < departmentsSnap.docs.length; i++) {
      const departmentDoc = departmentsSnap.docs[i];
      const departmentClassesSnap = await admin
        .firestore()
        .collection("classes")
        .where("department", "==", departmentDoc.id)
        .get();

      const departmentDocData = departmentDoc.data() as DepartmentDoc;

      let departmentClassWeekAvg = 0;
      for (let j = 0; j < departmentClassesSnap.docs.length; j++) {
        const classDoc = departmentClassesSnap.docs[j];
        departmentClassWeekAvg += classesWeeklyTotals[classDoc.id];
      }

      departmentClassWeekAvg =
        departmentClassWeekAvg / departmentClassesSnap.size || 0;

      // update the average total class time per user per class
      departmentDocData.total_time = departmentDocData.total_time || 0;
      departmentDocData.total_time += departmentClassWeekAvg;

      // update the number of weeks and then re-calculate the average
      departmentDocData.num_weeks = departmentDocData.num_weeks || 0;
      departmentDocData.num_weeks += 1;
      departmentDocData.weekly_average =
        departmentDocData.total_time / departmentDocData.num_weeks;

      // update the number of days then re-calculate the average
      departmentDocData.num_days = departmentDocData.num_days || 0;
      departmentDocData.num_days += 7;
      departmentDocData.daily_average =
        departmentDocData.total_time / departmentDocData.num_days;

      await departmentDoc.ref.update(departmentDocData);
    }
  });

// at the beginning of every month update all the monthly averages
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
        const classDocData = classesSnap.docs[i].data() as UserClassDoc;

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
