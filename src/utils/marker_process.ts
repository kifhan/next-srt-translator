import { json } from "stream/consumers";
import { OpenAIRequest } from "./OpenAI";

const MAX_RETRY = 3;

export async function generateMarkers(text: string) {
    let retries = 0;

    while (retries < MAX_RETRY) {
        try {
            let content = await OpenAIRequest({
                messages: [
                    {
                        role: 'user',
//                         content: `You are a travel information specialist proficient in extracting location data from text. 

// Your task is to analyze subtitle text (in .srt format) from a travel YouTube video and identify references to travel-relevant locations. These could include:

// * Place names (towns, regions)
// * Landmarks (natural or man-made)
// * Specific businesses (hotels, restaurants, shops)
// * General points of interest ("the old town", "the beach")

// For each location identified, output a structured JSON object containing:

// * 'name': The name of the location as mentioned in the text
// * 'country': The country of the location (if determinable, else leave blank)
// * 'address': If explicitly stated in the subtitles, otherwise leave blank
// * 'type': The type of location (e.g. city, landmark, business)
// * 'start_time': The timestamp in the video when the location is first mentioned
// * 'end_time': The timestamp when the location is last mentioned (or the segment ends)
// * 'location':  
//     * 'lat': Latitude of the location (if determinable, else leave blank)
//     * 'long': Longitude of the location (if determinable, else leave blank)

// Output the most specific location possible. Only include the level below the city (e.g. city, not country).

// Use external resources (maps, knowledge bases) to determine latitude/longitude if possible.

// output example:
// {
//     "status": "Success",
//     "results": [
//         {
//             "name": "Eiffel Tower",
//             "country": "France",
//             "address": "",
//             "type": "landmark",
//             "start_time": "00:01:23.456",
//             "end_time": "00:01:30.123",
//             "location": {
//                 "lat": 48.8584,
//                 "long": 2.2945
//             }
//         },
//         {
//             "name": "Central Park",
//             "country": "USA",
//             "address": "",
//             "type": "park",
//             "start_time": "00:02:45.678",
//             "end_time": "00:02:50.123",
//             "location": {
//                 "lat": 40.785091,
//                 "long": -73.968285
//             }
//         }
//     ]
// }

// If no locations are found in the subtitles, output:
// { "status": "No locations found", "results": [] }
//                         `
content: `You are a travel information specialist proficient in extracting location data from text. 

Your task is to analyze subtitle text (in .srt format) from a travel YouTube video and identify references to travel-relevant locations. These could include:

* Place names (towns, regions)
* Landmarks (natural or man-made)
* Specific businesses (hotels, restaurants, shops)
* General points of interest ("the old town", "the beach")

For each location identified, output a structured JSON object conforming to this TypeScript interface:

export interface MarkerData {
    id?: string;
    uid?: string;
    location: {
        lat: number;
        lng: number;
    };
    title: string;
    type: MarkerIconType;
    seekto?: string;
    description?: string;
    imgurl?: string; // URL of an image associated with the location, if not available leave blank
    seekAsSeconds?: number;
}

export type MarkerIconType = "info" | "me" | "jellyfish" | "jellyfishJump" | "alien" | "devil" | "exploding" | "ghost" | "poo" | "robot";


output example:
{
    "status": "Success",
    "results": [
        {
            "id": "1",
            "uid": "123",
            "location": {
                "lat": 48.8584,
                "lng": 2.2945
            },
            "title": "Eiffel Tower",
            "type": "info",
            "seekto": "00:01:23.456",
            "description": "A wrought-iron lattice tower on the Champ de Mars in Paris, France",
            "imgurl": "https://example.com/eiffel-tower.jpg",
            "seekAsSeconds": 83.456
        },
        {
            "id": "2",
            "uid": "456",
            "location": {
                "lat": 40.785091,
                "lng": -73.968285
            },
            "title": "Central Park",
            "type": "info",
            "seekto": "00:02:45.678",
            "description": "An urban park in New York City",
            "imgurl": "https://example.com/central-park.jpg",
            "seekAsSeconds": 165.678
        }
    ]
}

If no locations are found in the subtitles, output:
{ "status": "No locations found", "results": [] }
`
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                response_format: { type: "json_object" },
                // response_format: {
                //     type: 'json_schema',
                //     json_schema: {
                //         name: 'generate_markers',
                //         strict: true,
                //         schema: {
                //             "type": "object",
                //             "properties": {
                //                 "status": {
                //                     "type": "string"
                //                 },
                //                 "results": {
                //                     "type": "array",
                //                     "items": {
                //                         "type": "object",
                //                         "properties": {
                //                             "name": {
                //                                 "type": "string"
                //                             },
                //                             "address": {
                //                                 "type": "string"
                //                             },
                //                             "start_time": {
                //                                 "type": "string",
                //                                 "pattern": "^\\d{2}:\\d{2}:\\d{2}.\\d{3}$"
                //                             },
                //                             "end_time": {
                //                                 "type": "string",
                //                                 "pattern": "^\\d{2}:\\d{2}:\\d{2}.\\d{3}$"
                //                             },
                //                             "location": {
                //                                 "type": "object",
                //                                 "properties": {
                //                                     "lat": {
                //                                         "type": "number"
                //                                     },
                //                                     "long": {
                //                                         "type": "number"
                //                                     }
                //                                 },
                //                                 "required": ["lat", "long"]
                //                             }
                //                         },
                //                         "required": ["name", "start_time", "end_time", "location"]
                //                     }
                //                 }
                //             },
                //             "additionalProperties": false,
                //             "required": ["results", "status"]
                //         }
                //     }
                // }
            });

            return content;
        } catch (error) {
            retries++;
            console.error(error);
        }
    }

    return null;
}