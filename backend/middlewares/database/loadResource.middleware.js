import { db } from "#root/lib/firebase/config/firebaseAdmin.js";
import createError from "#root/lib/utils/createError.js";

const loadResource =
  ({
    paramKey = "id",
    reqKey = "resource",
    collectionName = "",
    ignoreNotFound = false,
    getId = () => {},
  }) =>
  async (req, _, next) => {
    const id = getId(req) || req.params[paramKey];

    if (!id) return next(createError("Invalid ID", 400));

    const resourceRef = db.collection(collectionName).doc(id);
    const resourceSnap = await resourceRef.get();

    if (!resourceSnap.exists) {
      if (ignoreNotFound) return next();
      return next(createError(`${reqKey} not found`, 404));
    }

    const resourceData = { id: resourceSnap.id, ...resourceSnap.data() };

    req[reqKey] = resourceData;
    req[reqKey + 'Ref'] = resourceRef;
    req[reqKey + 'Snap'] = resourceSnap;

    next();
  };

export default loadResource;
