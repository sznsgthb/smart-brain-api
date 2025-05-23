// import fetch from 'node-fetch';
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';

// const PAT = '355487b8bc1b4952b078065749745f53';
// const USER_ID = 'sznsgthb';
// const APP_ID = 'smart-brain';
// const MODEL_ID = 'Face-Sentiment';

const USER_ID = 'sznsgthb';
const PAT = '4c74d7dd1dab4bd49b33365b6f4c7c48';
const APP_ID = 'smart-brain';
const WORKFLOW_ID = 'face-sentiment';

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);


export const handleImage = (req, res, db) => {
    const { id } = req.body;
    
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
    .catch(err => res.status(400).json('Oops, unable to get the entries'))
};

export const handleApiCall = (req, res) => {
    const { input } = req.body; // input = image URL sent by the client

    stub.PostWorkflowResults(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            workflow_id: WORKFLOW_ID,
            inputs: [
                { data: { image: { url: input } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                return res.status(500).json("API call error: " + err);
            }

            if (response.status.code !== 10000) {
                return res.status(400).json("Post workflow failed: " + response.status.description);
            }

            const sentimentResults = [];
            const faceOutputs = response.results[0].outputs;

            for (const output of faceOutputs) {
                if (output.model.id === 'face-sentiment-recognition') {
                    const concepts = output.data.concepts || [];
                    sentimentResults.push(concepts); // Array of concepts for each face
                }
            }

            // Return the full response (both face and sentiment)
            res.json(response.results[0]);
        }
    );
};










// export const handleApiCall = (req, res) => {
//     const { input } = req.body; // The image URL comes from the client

//     const raw = JSON.stringify({
//         "user_app_id": {
//             "user_id": USER_ID,
//             "app_id": APP_ID
//         },
//         "inputs": [
//             {
//                 "data": {
//                     "image": {
//                         "url": input // Using the image URL from the client request
//                     }
//                 }
//             }
//         ]
//     });

//     const requestOptions = {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Authorization': 'Key ' + PAT,
//         },
//         body: raw
//     };

//     // Send the API request to Clarifai
//     fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, requestOptions)
//         .then(response => response.json())
//         .then(data => {
//             // Send the response back to the client
//             res.json(data);
//         })
//         .catch(err => {
//             res.status(400).json('Unable to process image.');
//         });
// };






/////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
/////////////////////////////////////////////////////////////////////////////








//   const returnClarifaiRequestOptions = (imageUrl) => {
//     const IMAGE_URL = imageUrl;

//     const raw = JSON.stringify({
//         "user_app_id": {
//             "user_id": USER_ID,
//             "app_id": APP_ID
//         },
//         "inputs": [
//             {
//                 "data": {
//                     "image": {
//                         "url": IMAGE_URL
//                     }
//                 }
//             }
//         ]
//     });

//     const requestOptions = {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Authorization': 'Key ' + PAT
//         },
//         body: raw
//     };

//     return requestOptions;
    
// }