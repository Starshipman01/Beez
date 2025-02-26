import { Client, Account, ID, Avatars, Databases, Query } from "react-native-appwrite";


// // import { account, ID } from '../services/appwrite';

// // const registerUser = async () => {
// //     try {
// //         const user = await account.create(ID.unique(), 'user@example.com', 'password123');
// //         console.log('User Created:', user);
// //     } catch (error) {
// //         console.error('Error:', error.message);
// //     }
// // };
const appwriteConfig ={
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.beez.beez',
  projectId:'67ae88180039974d256b',
  databaseId: '67ae8c58002154ea589f',
  userCollectionId: '67ae8c6c002a98051a6c',
  videoCollectionId: '67ae8c81000310b4aff2',
  storageId: '67ae8d5b0028bbc21ec7',


}

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);



const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

async function createUser (email, password, username) {
try{
  console.log('problems?')
  const newAccount = await account.create(
  ID.unique(), 
  email,
  password, 
  username
  )
  console.log('yes')
  if(!newAccount) throw Error('Failed to create Account');

  const avatarUrl = avatars.getInitials(username);

  await signIn(email, password);
  const newUser = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    ID.unique(),
    {
    accountId: newAccount.$id,
    email: email, 
    username: username, 
    avatar: avatarUrl
    }
  )
  
  console.log(`NEWUSER1: ${newUser}`)
  return newUser;
} catch (error){
  console.log(error);
  throw new Error(error);
}
}

 async function signIn(email, password) {
  
  try {
    const session = await account.createEmailPasswordSession(email, password)
    console.log(`NEWUSER2: ${session}`)
    return session
  } catch(error) {
    throw new Error(error)
  }



  // account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
  //     .then(function (response) {
  //         console.log(response);
  //     }, function (error) {
  //         console.log(error);
  //     });

}

const getCurrentUser = async () => {
  try{
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account found");



    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.userCollectionId,
      [Query.equal('accountId',currentAccount.$id)]
    )
    if (!currentUser || currentUser.documents.length === 0) throw new Error("User not found in database");
    return currentUser.documents[0]
  }catch (error) {
    console.log(error)
    return null;
  }
}


export { client, account, ID, appwriteConfig , createUser, signIn, getCurrentUser };
