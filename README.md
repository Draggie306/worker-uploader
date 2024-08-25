Quickly upload any file, losslessly, including images and videos, to a (Cloudflare R2) storage bucket!

## How to use
1. Go the URL
2. Input a valid code (`baguette`)
3. Select the files
4. Wait to upload
5. Send me the code displayed!

## How it works
A simple website is the frontend. When the files are selected, a Cloudflare worker is hit for each file uploaded, and simply uploads the file to a storage bucket in R2 (for cheap storage). My PC can then download/sync the file with rsync at any time. All files uploaded in a session are given a unique ID that stores them in a specific folder.

## why?

I am fed up receiving poor quality photos and videos sent through Instagram and other apps that people use. I am a passionate photographer and am passionate about high resolution photos, storing everything in their original quality.

Plus, I am a developer, after all! Why not make a simple website that can solve this quickly and easily. Instead of uploading to my PC directly, this is what storage buckets are for!

## Results
Results are a result! It is simple enough to not discourage any user, even though they might not be tech-literate. It is easier than using Google Drive/OneDrive as this requires a clunky app to download, then extra steps to login. 

This is why the appeal of a social media app is there: everyone is on it and it's simple to send files. *But they are compressed!* All that needs doing is sending a link to this page, the code and everyone finds it easier to share, and I get my original quality photos and files. 

Overall, a **win-win**!
