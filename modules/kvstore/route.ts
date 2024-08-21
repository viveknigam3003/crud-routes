import { Router } from "express";
import {
  ApplicationError,
  BadRequestError,
  NotFoundError,
} from "../common/errors";

const router = Router();

// key value pair

// 3 endpoints -> get, set, delete
// get -> input: key
// error code 404
// set -> input: key, value
// if the limit is hit -> evict some key value to make space
// random value -> random function
// LRU
// del -> input: key

// arbitrary cap -> 5

// eviction

const STORE_CAPACITY = 5;

type StoreType = {
  data: Record<string, string>;
  capacity: number;
};

const Store: StoreType = {
  data: {
    first: "second",
  },
  capacity: STORE_CAPACITY,
};

router.get("/getValue", async (req, res) => {
  const { key } = req.query;

  try {
    if (!key || typeof key !== "string") {
      throw new BadRequestError("Key is required in query");
    }

    console.log("store", Store);

    if (!(key in Store.data)) {
      throw new NotFoundError(`No key ${key} is present in store`);
    }

    // key found
    const value = Store.data[key];

    if (value === undefined) {
      throw new ApplicationError(
        500,
        "Something wrong with key, no value is set"
      );
    }

    res.status(200).json({
      [key]: value,
    });
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

const checkIfStoreIsFull = (store: StoreType): boolean => {
  const totalValuesInStore = Object.keys(store.data).length;

  return totalValuesInStore === store.capacity;
};


const getRndInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const evictRandomKey = (store: StoreType): string => {
//   const isStoreFull = checkIfStoreIsFull(store);

//   if (!isStoreFull) {
//     return null;
//   }

  const indexToEvict = getRndInteger(0, Object.keys(store.data).length);

  const keyAtIndex = Object.keys(store.data)[indexToEvict];
  delete store.data[keyAtIndex];

  return keyAtIndex;
};

router.post("/setValue", async (req, res) => {
  const { key, value } = req.body;

  try {
    if (!key || typeof key !== "string") {
      throw new BadRequestError("Key is required in query");
    }

    if (!value || typeof value !== "string") {
      throw new BadRequestError("Value is required in query");
    }
    // overrides allowed

    // if the capacity is hit
    const isStoreFull = checkIfStoreIsFull(Store);

    if (isStoreFull) {
        evictRandomKey(Store);
    }

    // if (!isStoreFull) {
    //   Store.data[key] = value;

    //   return res.status(201).json({
    //     [key]: value,
    //   });
    // }

    // // evict random if store is full
    // evictRandomKey(Store);

    Store.data[key] = value;

    console.log("Store", Store);
    return res.status(201).json({
      [key]: value,
    });
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

// Delete (skipped)

export default router;
