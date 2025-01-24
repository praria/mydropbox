# Welcome to My Self Hosted Dropbox
This project is an implementation of a self-hosted Dropbox-like application built using AWS Amplify, featuring user authentication, 
file upload functionality, file versioning, and listing. It also supports DNS and routing using Amplify Hosting.


## Task
We need a self-hosted, secure, and cost-effective file storage system with functionality similar to Dropbox, including:
1. User Authentication: To ensure only authorized users access the system
2. File Upload and Versioning: To manage files efficiently and track versions with timestamps
3. File Listing: To display uploaded files in an organized manner
4. Routing and DNS: To provide a custom domain and secure HTTPS access for users.


## Description
This project solves the problem by leveraging AWS Amplify and React.js frontend.
1. Authentication: AWS Amplify'S Authentication module ensures secure user loging and signup.
2. File Management: Built-in functionality for uploading, listing, and versioning files, with timestamps appended to filenames to distinguish versions.
3. Hosting: AWS Amplify hosting and easy-to-setup process for routing and domain configuration.
4. Responsive UI: The React-based frontend ensures an intuitive experience for the users.
5. Scalable Architecture: The app is built to scale effortlessly using AWS's infrastructure.


## Installation
Follow these steps to install the project on your system
1. Clone the repository:
    - git clone repo url https://git.us.qwasar.io/my_self_hosted_dropbox_177480_133j1s/my_self_hosted_dropbox.git
    - cd repo name my-self-hosted-dropbox
2. Install Dependencies: use `npm install` to install all necessary packages
3. Configure Amplify: Initialize Amplify in the project by running the command - amplify init 
4. Set up Authentication: Add AWS Amplify's authentication module
    - amplify add auth
    - amplify push
5. Deploy to Amplify Hosting: To enable hosting
    - amplify hosting add 
    - amplify publish



## Usage
1. Run locally: Start the development server (opens the app in the browser at http://localhost: 3000)
    - npm start
2. File Upload:
    - Log in or sign up to access the file upload interface
    - Choose a file to upload, and the app will automatically append a timestamp to the filename for versioning 
    - Uploaded files are listed along with their timestamps.
3. Access the Deployed application (hosted app) using the Amplify-provided domain (URL):
    - Acessing via Amplify hosting URL ( https://dev.d3rm7zj17zm2iw.amplifyapp.com)
    - Accessing via S3AndCloudFront URL (https://ddny6gglpb84j.cloudfront.net)
4. Custom Domain Configuration:
    - You may add a custom domain in the AWS Amplify Console
    - Update DNS settings with the domain provider to point to Amplify
    

### The Core Team
-- Prakash Shrestha --


<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
