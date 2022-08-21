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

export { addOneFamMember };
