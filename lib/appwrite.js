import { Client, Account, ID, Avatars, Databases, Query, Storage } from "react-native-appwrite";

// /import { account, ID } from '../services/appwrite';
import { appwriteConfig } from './appwriteKeys';
import { expressKeys } from './expressKeys';

// // const registerUser = async () => {
// //     try {
// //         const user = await account.create(ID.unique(), 'user@example.com', 'password123');
// //         // console.log('User Created:', user);
// //     } catch (error) {
// //         console.error('Error:', error.message);
// //     }
// // };

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)
  .setSession(''); // The user session to authenticate with;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

const getFileName = (uri) => uri.split('/').pop();

async function createUser (email, password, username) {
  console.log("ADDRESS USED: ", expressKeys.registrationURL)
  try{ 
    const response = await fetch(expressKeys.registrationURL, {
      method:"POST",
      headers:{ 
        "Content-Type":"application/json",
      },
      body: JSON.stringify({username, email, password})
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await signIn(email, password)
    console.log("User registered successfully:", data);
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
  }

}

 async function signIn(email, password) {
  console.log("ADDRESS USED: ", expressKeys.signInURL)
  try{ 
    const response = await fetch(expressKeys.signInURL, {
      method:"POST",
      headers:{ 
        "Content-Type":"application/json",
      },
      body: JSON.stringify({email, password})
    })
    const data = await response.json();
    console.log("data: ", data)
    
    if (!response.ok) {
      console.log("Response not Okay")
      console.log(response)
      throw new Error(data.message);
    }
    console.log("User Signed in successfully:", data);
    return data;
  } catch (error) {
    console.log("Error Caight")
    console.error("Error: ", error);
    throw new Error(error,)
  }
  // try {
  //   const session = await account.createEmailPasswordSession(email, password)
  //   // console.log(`NEWUSER2: ${session}`)
  //   return session
  // } catch(error) {
  //   throw new Error(error)
  // }
  


 

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
    // console.log(error)
    return null;
  }
}

const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    )
    // console.log(posts)
    // console.log(posts.documents)
    // console.log("DEBIG")
  return posts.documents
  }
    catch (error) {
      throw new Error(error)
    }
  }

  const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt',Query.limit(7))]
    )
  return posts.documents
  }
    catch (error) {
      throw new Error(error)
    }
  }
  const searchPosts = async (query) => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.search('title', query)]
      )
    return posts.documents
    }
      catch (error) {
        throw new Error(error)
      }
    }

    const getUserPosts = async (userId) => {
      try {
        const posts = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.videoCollectionId,
          [Query.contains('creator', userId)]
        )
        // console.log("APPWRITE")
        // console.log(posts.documents)
        // console.log(userId)

      return posts.documents
      }
        catch (error) {
          // console.log("getUserPost Error")
          // console.log(error)
          throw new Error(error)
        }
      }

    const signOut = async() => {
      try{
          const session = await account.deleteSession("current")
          return session
      } catch (error){
        throw new Error(error)
      }
    }

    const getFilePreview = async(fileId, type) => {
      let fileUrl

      try{
        if (type === 'video'){
          fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
        } else if(type ==='image'){
          fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100)
        } else{
          throw new Error("Invalid file type")
        }
        if(!fileUrl) throw Error;

        return fileUrl

      } catch(error){throw new Error(error)}

    }

    const uploadFile = async(file, type) =>{
      if(!file) return;
      const fileName = getFileName(file.uri); // Extract filename
      const {mimeType, ...rest} = file
      const asset = {
        name: fileName || `file.${file.mimeType.split('/')[1]}`,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
      }

      // console.log("FILE", file)

      try{
        // console.log("uploadFile storage: ",appwriteConfig.storageId,  
          // ID.unique(),
          // asset )
        const uploadedFile = await storage.createFile(
          appwriteConfig.storageId,  
          ID.unique(),
          asset
        )
        // console.log("UPLOADED", uploadedFile)

        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        return fileUrl
      } catch(error){
        // console.log("Error in uploadFile in appwrite.js", error)
        throw new Error(error)
      }

    }

    const createVideo = async(form) => {
      // console.log("createvideo test")
      // console.log(form)
      try{ 
        const[thumbnailUrl, videoUrl] = await Promise.all([
          uploadFile(form.thumbnail, 'image'),
          uploadFile(form.video, 'video')
        ])
        // console.log("createvideo part 2")
        const newPost = await databases.createDocument(
          appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            users: form.userId,
            creator: form.userId

            // users: form.user
            // fileId: "TEST"
            // This one depends change
          }
          

          
        )
        // console.log("appwrite success")
        return newPost
      }
      catch(error) {
        // console.log("createVideo Error")
        throw new Error(error)
      }

    }
 


export { client,
  account, 
  ID, 
  appwriteConfig , 
  createUser, 
  signIn, 
  getCurrentUser, 
  getAllPosts, 
  getLatestPosts, 
  searchPosts, 
  getUserPosts, 
  signOut,
  createVideo,
  uploadFile,
  getFilePreview
 };
