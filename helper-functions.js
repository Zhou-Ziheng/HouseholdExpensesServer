import fetch from "node-fetch";

async function addOneFamMember(memId, famId) {
  let allMembers = [memId];
  const response = await fetch("http://localhost:3000/api/families/" + famId);
  const family = await response.json(); //extract JSON from the http response

  for (let i = 0; i < family.familyMembers.length; i++) {
    allMembers.push(family.familyMembers[i]._id);
  }
  console.log(family.familyName);
  console.log(allMembers);

  const putResponse = await fetch(
    "http://localhost:3000/api/families/" + famId,
    {
      method: "PUT",
      body: JSON.stringify({
        familyName: family.familyName,
        familyMemberIds: allMembers,
      }), // string or object
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(putResponse);
  console.log("\n");
  const newFamily = await putResponse.json();
  console.log(newFamily);
}

async function addOneItem(itemId, categoryId, userId) {
  let allItemIds = [itemId];
  const response = await fetch(
    "http://localhost:3000/api/categories/" + categoryId
  );
  const category = await response.json(); //extract JSON from the http response

  for (let i = 0; i < category.items.length; i++) {
    allItemIds.push(category.items[i]._id);
  }

  const putResponse = await fetch(
    "http://localhost:3000/api/categories/" + categoryId,
    {
      method: "PUT",
      body: JSON.stringify({
        category: category.category,
        itemIds: allItemIds,
      }), // string or object
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("ayo", userId);
  if (userId) {
    await fetch(
      "http://localhost:3000/api/family-members/updateUsed/" + userId,
      {
        method: "PUT",
        body: JSON.stringify({}), // string or object
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const updatedCategory = await putResponse.json();
  return updatedCategory;
}

async function addOneCategory(catId, memId) {
  let allCatIds = [catId];
  const response = await fetch(
    "http://localhost:3000/api/family-members/" + memId
  );
  const member = await response.json(); //extract JSON from the http response

  for (let i = 0; i < member.categories.length; i++) {
    allCatIds.push(member.categories[i]._id);
  }

  const putResponse = await fetch(
    "http://localhost:3000/api/family-members/" + memId,
    {
      method: "PUT",
      body: JSON.stringify({
        name: member.name,
        username: member.username,
        categoryIds: allCatIds,
      }), // string or object
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const updatedMember = await putResponse.json();
  console.log(member);
}

// async function addFamId(memId, famId) {
//     const response = await fetch("http://localhost:3000/api/family-members/" + memId);
//     const member = await response.json(); //extract JSON from the http response

//     const putResponse = await fetch(
//         "http://localhost:3000/api/family-members/" + memId,
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             name: member.name,
//             username: member.username,
//             familyId: famId
//           }), // string or object
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const updatedMember = await putResponse.json();
//       console.log(member);
// }

export { addOneFamMember, addOneItem, addOneCategory };
