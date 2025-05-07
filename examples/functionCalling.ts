import GeminiClient from '../src';
import { FunctionCallingMode, SchemaType } from '../src/types';

// Set your API key
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';

// Initialize the client
const gemini = new GeminiClient(API_KEY);

// Define example functions that the model can call
// These would typically make real API calls or perform actual operations
async function getWeatherData(location: string) {
  console.log(`Getting weather data for ${location}...`);
  // This would normally call a real weather API
  return {
    location,
    temperature: 22,
    unit: 'Celsius',
    conditions: 'Partly cloudy',
    humidity: 60,
    windSpeed: 12,
    windDirection: 'NW'
  };
}

async function scheduleMeeting(attendees: string[], date: string, time: string, topic: string) {
  console.log(`Scheduling meeting on ${date} at ${time} about "${topic}" with ${attendees.join(', ')}`);
  // This would normally interact with a calendar API
  return {
    meetingId: 'mtg_' + Date.now(),
    confirmed: true,
    meetingUrl: 'https://meet.example.com/abc123',
    calendar: 'Work',
    notificationsSent: attendees.length
  };
}

async function setLightValues(brightness: number, color_temp: string) {
  console.log(`Setting lights to ${brightness}% brightness with ${color_temp} temperature`);
  // This would normally control smart home devices
  return {
    success: true,
    brightness,
    colorTemperature: color_temp,
    device: 'Living Room Lights',
    powerState: brightness > 0 ? 'ON' : 'OFF'
  };
}

async function main() {
  try {
    // Example 1: Basic Weather Function
    console.log("\n=== Example 1: Basic Weather Function ===");
    const weatherFunctionDeclaration = {
      name: 'get_current_temperature',
      description: 'Gets the current temperature and weather data for a given location.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          location: {
            type: SchemaType.STRING,
            description: 'The city name, e.g. San Francisco',
          },
        },
        required: ['location'],
      },
    };

    const weatherResponse = await gemini.functionCalling.generate(
      "What's the temperature in London?",
      [weatherFunctionDeclaration]
    );

    if (weatherResponse.functionCalls && weatherResponse.functionCalls.length > 0) {
      const functionCall = weatherResponse.functionCalls[0];
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      
      // Execute the function with the provided arguments
      const result = await getWeatherData(functionCall.args.location);
      console.log(`Function result: ${JSON.stringify(result)}`);
      
      // Create a function response
      const functionResponse = {
        name: functionCall.name,
        response: { result }
      };
      
      // Send the function response back to the model
      const finalResponse = await gemini.functionCalling.sendFunctionResponse(
        "What's the temperature in London?",
        [weatherFunctionDeclaration],
        functionCall,
        functionResponse
      );
      
      console.log(`Final response: ${finalResponse.text}`);
    } else {
      console.log("No function call found in the response.");
      console.log(weatherResponse.text);
    }

    // Example 2: Meeting Scheduler with Forced Function Calling (ANY mode)
    console.log("\n=== Example 2: Meeting Scheduler with Forced Function Calling ===");
    const scheduleMeetingFunctionDeclaration = {
      name: 'schedule_meeting',
      description: 'Schedules a meeting with specified attendees at a given time and date.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          attendees: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'List of people attending the meeting.',
          },
          date: {
            type: SchemaType.STRING,
            description: 'Date of the meeting (e.g., "2024-07-29")',
          },
          time: {
            type: SchemaType.STRING,
            description: 'Time of the meeting (e.g., "15:00")',
          },
          topic: {
            type: SchemaType.STRING,
            description: 'The subject or topic of the meeting.',
          },
        },
        required: ['attendees', 'date', 'time', 'topic'],
      },
    };

    const scheduleResponse = await gemini.functionCalling.generateWithMode(
      "Schedule a meeting with Bob and Alice for tomorrow at 3pm about Q3 planning.",
      [scheduleMeetingFunctionDeclaration],
      FunctionCallingMode.ANY // Force the model to call a function
    );

    if (scheduleResponse.functionCalls && scheduleResponse.functionCalls.length > 0) {
      const functionCall = scheduleResponse.functionCalls[0];
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments:`, functionCall.args);
      
      // Execute the function with the provided arguments
      const result = await scheduleMeeting(
        functionCall.args.attendees,
        functionCall.args.date,
        functionCall.args.time,
        functionCall.args.topic
      );
      
      // Create a function response
      const functionResponse = {
        name: functionCall.name,
        response: { result }
      };
      
      // Send the function response back to the model
      const finalResponse = await gemini.functionCalling.sendFunctionResponse(
        "Schedule a meeting with Bob and Alice for tomorrow at 3pm about Q3 planning.",
        [scheduleMeetingFunctionDeclaration],
        functionCall,
        functionResponse
      );
      
      console.log(`Final response: ${finalResponse.text}`);
    }

    // Example 3: Multiple Functions with Parallel Function Calling
    console.log("\n=== Example 3: Multiple Functions with Parallel Function Calling ===");
    const powerDiscoBall = {
      name: 'power_disco_ball',
      description: 'Powers the spinning disco ball.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          power: {
            type: SchemaType.BOOLEAN,
            description: 'Whether to turn the disco ball on or off.',
          }
        },
        required: ['power'],
      },
    };

    const startMusic = {
      name: 'start_music',
      description: 'Play some music matching the specified parameters.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          energetic: {
            type: SchemaType.BOOLEAN,
            description: 'Whether the music is energetic or not.',
          },
          loud: {
            type: SchemaType.BOOLEAN,
            description: 'Whether the music is loud or not.',
          }
        },
        required: ['energetic', 'loud'],
      },
    };

    const dimLights = {
      name: 'dim_lights',
      description: 'Dim the lights to a specified brightness.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          brightness: {
            type: SchemaType.NUMBER,
            description: 'Light level from 0 to 100. Zero is off and 100 is full brightness.',
          },
          color_temp: {
            type: SchemaType.STRING,
            enum: ['daylight', 'cool', 'warm'],
            description: 'Color temperature of the light fixture, which can be daylight, cool or warm.',
          },
        },
        required: ['brightness', 'color_temp'],
      },
    };

    const partyResponse = await gemini.functionCalling.generateParallel(
      "Turn this place into a party!",
      [powerDiscoBall, startMusic, dimLights]
    );

    if (partyResponse.functionCalls) {
      console.log(`Received ${partyResponse.functionCalls.length} function calls`);
      
      for (const functionCall of partyResponse.functionCalls) {
        console.log(`\nFunction: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
        
        // Execute each function depending on its name
        if (functionCall.name === 'dim_lights') {
          const result = await setLightValues(
            functionCall.args.brightness,
            functionCall.args.color_temp
          );
          console.log(`Function result: ${JSON.stringify(result)}`);
        }
        // We would implement the other functions similarly
      }
    }

    // Example 4: Function Calling in Chat
    console.log("\n=== Example 4: Function Calling in Chat ===");
    const chat = gemini.chat.createFunctionCallingChat([weatherFunctionDeclaration]);
    
    const chatResponse1 = await chat.sendMessage(
      "I'm planning a trip. What's the weather like in Paris?"
    );
    
    if (chatResponse1.functionCalls && chatResponse1.functionCalls.length > 0) {
      const functionCall = chatResponse1.functionCalls[0];
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      
      // Execute the function with the provided arguments
      const result = await getWeatherData(functionCall.args.location);
      
      // Send the function result back to the conversation
      const chatResponse2 = await chat.sendFunctionResponse(functionCall, result);
      console.log(`Chat response after function: ${chatResponse2.text}`);
      
      // Continue the conversation
      const chatResponse3 = await chat.sendMessage(
        "What about Rome? How's the weather there?"
      );
      
      if (chatResponse3.functionCalls && chatResponse3.functionCalls.length > 0) {
        const functionCall2 = chatResponse3.functionCalls[0];
        const result2 = await getWeatherData(functionCall2.args.location);
        const chatResponse4 = await chat.sendFunctionResponse(functionCall2, result2);
        console.log(`Final chat response: ${chatResponse4.text}`);
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main(); 