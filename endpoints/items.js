const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const { response } = require("express");
const { Types } = mongoose;
const TESTING_USER_ID = "62310f4c8a254e63fd7b1bc9";

router
  .route("/")
  .get(auth, async (request, response) => {
    const { userId } = request.query;
    console.log("llego");
    console.log({ userId });
    if (userId === undefined) {
      response.status(403).send("User ID is missing");
    }
    // if (year === undefined && month === undefined) {
    //   response.status(403).send("Date filter is missing");
    // }

    const filters = {
      userId: userId,
      //...dateFilter(request.query),
    };
    //console.log({ filters });
    try {
      const findedItems = await Item.find(filters);
      console.log("paso");
      const months = getMonthsList(findedItems);
      response.status(200).json(months);
    } catch (error) {
      response.status(404).send(error.message);
    }
  })
  .post(async (request, response) => {
    const { body } = request;
    const { userId, date, concept, details, amount } = body;
    const itemModel = new Item({
      userId: userId,
      date: date,
      concept: concept,
      details: details,
      amount: amount,
    });
    try {
      const savedItem = await itemModel.save();
      response.status(201).json(savedItem);
    } catch (error) {
      console.error(error);
      response.status(400).send(error.message);
    }
  })
  .delete(async (request, response) => {
    const { itemId } = request.query;
    if (itemId === undefined) {
      response.status(403).send("Item ID is missing");
    }
    try {
      deletedItem = await Item.deleteOne({ _id: itemId });
      response.status(200).json({ deletedItem: deletedItem });
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  })
  .put(async (request, response) => {
    const { itemId } = request.query;
    // const {updatedItem} = request.body
    if (itemId === undefined) {
      response.status(403).send("Item ID is missing");
    }
    const { userId, date, concept, details, amount } = request.body;
    const itemModel = new Item({
      userId: userId,
      date: date,
      concept: concept,
      details: details,
      amount: amount,
    });
    try {
      const savedItem = await itemModel.save();
      console.log({ savedItem });
      response.json({ updatedItem: savedItem });
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });

module.exports = router;

const dateFilter = (query) => {
  const year = query.year || query.month.split("-")[0];
  const month = query.month ? query.month.split("-")[1] : "01";
  const monthNumber = Number.parseInt(month);
  const date1 = new Date(year, monthNumber - 1);
  const date2 = new Date(year, query.month ? monthNumber : 11);
  console.log(date1.toISOString());
  console.log(date2.toISOString());

  const filters = {
    date: { $gte: new Date(date1), $lte: new Date(date2) },
  };
  return filters;
};

const getMonthsList = (items) => {
  let months = [];
  pushMonths(2021, months);
  pushMonths(2022, months);
  items.sort((a, b) => a.date - b.date);
  fillMonths(items, months);
  return months;
};

const pushMonths = (year, array) => {
  for (let i = 0; i < 12; i++) {
    array.push({
      month: new Date(year, i, 1),
      INCOME: [],
      EXPENSE: [],
    });
  }
};

//Llena las listas de INCOME y EXPENSE del mes correspondiente a cada item
const fillMonths = (items, monthsList) => {
  items.forEach((item) => {
    let year = item.date.getFullYear();
    let month = item.date.getMonth();
    let day = item.date.getDate();
    const itemDate = new Date(year, day == 31 ? month + 1 : month); //creo la misma fecha sin contar el día

    const findedItem = monthsList.find(
      (elem) => elem.month.toISOString() === itemDate.toISOString()
    ); //encuentro el mes correspondiente a esta fecha
    findedItem[item.concept].push(item); //agrego el item a su lista de INCOME / EXPENSE dependiendo del concept del item
  });
};
