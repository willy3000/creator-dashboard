# Dev Journal (5–10 bullets)

Write a short log of what went wrong, what you tried, and what fixed it.

- File uploads worked but I could only access images but documents returned a "could not be found error". 
- I thought it was a code issue at first but when I checked out the storage bucket settings, I realised it was a permissions related issue.
- I fixed it by allowing all file types to be accessed via url.
- All other file types successfully uploaded but video uploads failed.
- I realised that I was using base64 to upload the documents but videos were too large for base64.
- I switched to streaming uploads using a javascript library called streamifier.
-Assets fetch fuction would fail and rturn an empty list even though I had assets in the database.
- I realised that by te time the fetch function was running, the user object was still null and therefore it would fetch assets for userId undefined.
I changed my useEffect dependancy array to include user and that way it would fetch the assets whenever the user changed from null.
