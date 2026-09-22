import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function runTests() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = (await import('./models/User.js')).default;
    const { signAuthToken } = await import('./utils/auth.js');
    
    // Find a user to test with
    const user = await User.findOne();
    if (!user) throw new Error("No user found in DB to test with");
    
    // Generate token
    const token = signAuthToken(user);
    console.log("Got user token for:", user.name);
    
    const headers = { 'Authorization': `Bearer ${token}` };
    
    console.log("\n--- TEST 1: Text-only Post ---");
    const res1 = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test post from backend script!' })
    });
    
    const data1 = await res1.json();
    if (res1.ok) {
      console.log("PASS: Text-only post created. ID:", data1._id);
    } else {
      console.log("FAIL: Text-only post", data1);
    }
    
    console.log("\n--- TEST 2: Image Upload (Mocking Frontend FormData) ---");
    const formData = new FormData();
    formData.append('image', new Blob(['fake image data'], { type: 'image/jpeg' }), 'test.jpg');
    
    const res2 = await fetch('http://localhost:5000/api/posts/upload-image', {
      method: 'POST',
      headers,
      body: formData
    });
    
    const data2 = await res2.json();
    let imageUrl = null;
    if (res2.ok && data2.url) {
      console.log("PASS: Image upload succeeded. URL:", data2.url);
      imageUrl = data2.url;
    } else {
      console.log("FAIL: Image upload failed.", data2);
    }
    
    if (imageUrl) {
      console.log("\n--- TEST 3: Image + Text Post ---");
      const res3 = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test post with image!', image: imageUrl })
      });
      
      const data3 = await res3.json();
      if (res3.ok) {
        console.log("PASS: Image+Text post created. ID:", data3._id);
      } else {
        console.log("FAIL: Image+Text post", data3);
      }
    }
    
    console.log("\n--- TEST 4: Empty Post Validation ---");
    const res4 = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '' })
    });
    const data4 = await res4.json();
    if (!res4.ok) {
      console.log("PASS: Empty post properly rejected with status", res4.status, "message:", data4.message);
    } else {
      console.log("FAIL: Empty post was accepted!");
    }
    
  } catch (error) {
    console.error("Test script failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
