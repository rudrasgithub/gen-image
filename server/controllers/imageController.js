import userModel from "../models/userModel.js";
import FormData from 'form-data'
import axios from 'axios'

export const generateImage = async (req, res) => {
    try {
        const { userId } = req;
        const { prompt } = req.body;
        if (!userId || !prompt) {
            return res.json({ success: false, message: 'Missing Fields' })
        }

        const user = await userModel.findById(userId)

        if (user.creditBalance === 0 || userModel.creditBalance < 0) {
            return res.json({ success: false, message: 'No Credit balance', creditBalance: user.creditBalance })
        }
        const formData = new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIP_DROP_API,
            },
            responseType: 'arraybuffer'
        })
        const base64Image = Buffer.from(data, 'binary').toString('base64')

        const resultImage = `data:image/png;base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, {
            creditBalance: user.creditBalance - 1
        })

        res.json({ success: true, message: 'Image generated', creditBalance: user.creditBalance - 1, resultImage })
    } catch (err) {
        console.log(err.message)
        res.json({ success: false, message: err.message })
    }
}