const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res
        .status(400)
        .json({ message: 'Sorry there was an error, no categories found' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res
        .status(400)
        .json({
          message: 'Sorry there was an error, no categorie found with that ID',
        });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategoryData = await Category.create(req.body);
    if (!newCategoryData) {
      res
        .status(400)
        .json({ message: 'Sorry there was an error, no categories found' });
      return;
    }
    res.status(200).json(newCategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value

  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((updatedCategory) => {
      res.status(200).json(updatedCategory);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//DELETE ROUTE - NOTE (IMPORTANT):
//category table that is referenced by a foreign key constraint
//in the product table.The foreign key constraint is defined as
//product_ibfk_1 and it links the category_id column in the product
//table to the id column in the category table.

//In order to be able to reslove tgis route we need to handle the casacade manually
// to proceed with the deletion or update operation on the category table while
//preserving referential integrity, you'll need to manually handle the cascading
//changes in the product table.This involves either updating the category_id values
//in the product table to a valid id from the category table or deleting the related
//rows in the product table before making changes to the category table.

// 1) In this case we are first deleting the row in the Product table where the foreign constraint
//    category_id in this case is equals to req.params.id

// 2) Then after the promise is resolved we are able to destroy the category
//    which was referencing to the row in the Product table, the one we just deleted
router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Product.destroy({ where: { category_id: req.params.id } })
    .then(() => {
      Category.destroy({ where: { id: req.params.id } }).then(() => {
        res.status(200).json('Deleted');
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
