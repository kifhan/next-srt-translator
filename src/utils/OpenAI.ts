const DEFAULT_MODEL = "gpt-4o-mini";
// const DEFAULT_MODEL = "gpt-3.5-turbo";

export type ChatGPTMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export interface OpenAIStreamPayload {
    model?: string;
    messages: ChatGPTMessage[];
    api_url?: string;
    req_path?: string;
    api_key?: string;
}

export async function OpenAIStream({ 
    model = DEFAULT_MODEL, 
    messages,
 }: OpenAIStreamPayload) {
    const res = await fetch("/api/openai", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ model, messages }),
    });

    const stream = await res.json();

    try {
        console.log(stream);
        if (stream.error) return stream.error.message;
        return stream?.choices[0]?.message?.content || ''
    } catch (e) {
        return e
    }
}

// {
//     "data": {
//       "id": "chatcmpl-9B5dGXjF2cFk7lrDTOaYBU5TV8F17",
//       "object": "chat.completion",
//       "created": 1712430286,
//       "model": "gpt-3.5-turbo-0125",
//       "choices": [
//         {
//           "index": 0,
//           "message": {
//             "role": "assistant",
//             "content": "1\n00:00:00,000 --> 00:00:01,899\n慵懒的小狗\n\n2\n00:00:01,899 --> 00:00:04,900\n吃饭的豚鼠\n\n3\n00:00:04,900 --> 00:00:05,933\n海边散步\n\n4\n00:00:05,933 --> 00:00:11,433\n与新朋友快乐的一天\n\n5\n00:00:11,433 --> 00:00:13,933\n大家好，我是快乐小鸟\n\n6\n00:00:13,933 --> 00:00:18,566\n我依旧是探索者，正在去吃早餐\n\n7\n00:00:18,566 --> 00:00:22,866\n我已经在台湾待了两个多星期了\n\n8\n00:00:22,866 --> 00:00:27,266\n剩下的时间不多了，考虑剩下的日子要做什么\n\n9\n00:00:27,266 --> 00:00:28,866\n因为我有在泰中的台湾朋友 💖\n\n10\n00:00:28,866 --> 00:00:31,566\n这些是我在纽约认识的朋友\n\n11\n00:00:31,566 --> 00:00:38,299\n我觉得去一次泰中也挺好的，所以，计划后天去泰中两天\n\n12\n00:00:38,299 --> 00:00:41,299\n但这么一想，我在探索者的日子也不剩多少了\n\n13\n00:00:41,299 --> 00:00:45,833\n所以今天明天我想多去逛逛探险者\n\n14\n00:00:45,833 --> 00:00:48,233\n首先要吃顿饭\n\n15\n00:00:56,133 --> 00:01:00,133\n顺便说一句，大家，探索者真的很漂亮\n\n16\n00:01:00,133 --> 00:01:08,066\n我一直认为，台湾一半像日本，一半像中国\n\n17\n00:01:08,066 --> 00:01:15,799\n走在巷子里，有些小巷子感觉像是日本的小城镇或乡村"
//           },
//           "logprobs": null,
//           "finish_reason": "stop"
//         }
//       ],
//       "usage": {
//         "prompt_tokens": 854,
//         "completion_tokens": 643,
//         "total_tokens": 1497
//       },
//       "system_fingerprint": "fp_b28b39ffa8"
//     }
//   }