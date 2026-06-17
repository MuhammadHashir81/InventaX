import { Product } from "../models/product.model.js"
import { Invoice } from "../models/Invoice.model.js"
import { productSchema } from "../validations/product.validation.js"
import { Customer } from "../models/customer.model.js"


// handle get all products
const handleGetAllProducts = async (req, res) => {
    const { userId } = req
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const totalProducts = await Product.countDocuments({ tenantId: userId })

        const totalPages = Math.ceil(totalProducts / limit)

        const products = await Product.find({ tenantId: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            success: true,
            totalProducts: totalProducts,
            totalPages: totalPages,
            data: products,
            skip: skip

        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })

    }

}

// handle add products
const handleAddProduct = async (req, res) => {
    const { userId } = req
    try {
        const { name, packing, batchNo, barcode } = req.body
        const result = productSchema.safeParse(req.body)

        if (!result.success) {
            const err = result.error.issues.map((e) => e.message)
            console.log(err)
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        const savedPacking = await Product.create({
            name,
            packing,
            batchNo,
            barcode,
            tenantId: userId
        })
        return res.status(201).json({
            sucess: true,
            message: 'product added',
            data: savedPacking,
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }

}

// handle update products 

const handleUpdateProduct = async (req, res) => {
    try {
        const { userId } = req
        const { id } = req.params
        const { name, packing, batchNo, barcode } = req.body

        const updateProduct = {}
        if (name) updateProduct.name = name
        if (packing) updateProduct.packing = packing
        if (batchNo) updateProduct.batchNo = batchNo
        if (barcode) updateProduct.barcode = barcode

        const upatedProduct = await Product.findOneAndUpdate({
            _id: id,
            tenantId: userId,
        },
            updateProduct,
            {
                new: true
            }
        )
        res.status(200).json({
            success: true,
            message: "product updated successfully",
            data: upatedProduct
        })

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

// handle delete products   

const handleDeleteProduct = async (req, res) => {
    try {
        const { userId } = req
        const { id } = req.params
        const deletedProduct = await Product.findOneAndDelete({
            _id:id,
            tenantId:userId
        })
        if (!id) {
            return res.status(404).json({
                success: false,
                error: 'product does not exists',
                data: deletedProduct
            })
        }
        res.status(200).json({
            success: true,
            message: 'product deleted successfully'
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

// searched products 
const handleSearchedProducts = async (req, res) => {
    const { userId } = req
    try {
        const search = req.query.q
        const searchedProducts = await Product.find({
            tenantId:userId,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { packing: { $regex: search, $options: 'i' } },
                { barcode: { $regex: search, $options: 'i' } },
                { batchNo: { $regex: search, $options: 'i' } },
            ]
        })
        const totalCounts = await Product.countDocuments({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { packing: { $regex: search, $options: 'i' } },
                { barcode: { $regex: search, $options: 'i' } },
                { batchNo: { $regex: search, $options: 'i' } },
            ]
        })
        res.status(200).json({
            success: false,
            data: searchedProducts,
            totalProducts: totalCounts
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}




export { handleAddProduct, handleGetAllProducts, handleUpdateProduct, handleDeleteProduct, handleSearchedProducts }