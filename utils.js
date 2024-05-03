import Chapter from './Chapter.js';

/*
Validate the buyer's name
parameters: chapterId - the id of the chapter in db
            nameRu - the buyer's name in Russian (optional)
            nameHe - the buyer's name in Hebrew (optional)
returns: the buyer's name in hebrew and russian
*/
const validateChapterBuyer = async (chapterId, nameRu, nameHe) => {
  const chapterDoc = await Chapter.findById(chapterId);
  // If the buyer's name is provided in the query try updating it in the database
  if (nameRu || nameHe) {
    // TODO implement translation or an equivalent
    return await updateBuyer(chapterDoc, nameRu, nameHe);
  } else {
    return await getBuyer(chapterDoc);
  }
};


/*
Update buyer in the database
parameters: chapter - mongoose document of the chapter
            nameRu - the buyer's name in Russian
            nameHe - the buyer's name in Hebrew
returns: updated buyer field from the database or throws an error if the buyer already exists
*/
const updateBuyer = async (chapter, nameRu, nameHe) => {
  // If the buyer's name is not provided in the database, update it
  if (!(chapter.buyer?.nameRu || chapter.buyer?.nameHe)) {
    chapter.buyer = {
      nameRu: nameRu,
      nameHe: nameHe,
    };
    await chapter.save();
    return chapter.buyer;
    // If the buyer's name is already provided in the database, throw an error
  } else {
    throw new Error('Buyer already exists');
  }
};

//If the buyer's name is not provided in the query, get it from the database
const getBuyer = async (chapter) => {
  return chapter.buyer;
};

export default validateChapterBuyer;
