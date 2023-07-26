const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allTagData = Tag.findAll({
      include: [
        {
          model: Product,
          attributes: ['product_name'],
          through: { attributes: [] },
        },
      ],
    }).then((tagData) => {
      res.status(200).json(tagData);
    });
    if (!allTagData) {
      res.status(400).json({
        message: 'Sorry there was an error while retrieveing, no tags found',
      });
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['product_name'],
          through: { attributes: [] },
        },
      ],
    })
      .then((singleTagData) => {
        if (!singleTagData || singleTagData === null) {
          res
            .status(404)
            .json({ message: 'Sorry, no data found with the specifiedID' });
        }
        res.status(200).json(singleTagData);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((newTagData) => {
      res.status(200).json(newTagData);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value

  Tag.update({ tag_name: req.body.tag_name }, { where: { id: req.params.id } })
    .then((updatedTag) => {
      res.status(200).json(updatedTag);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedData = Tag.destroy({ where: { id: req.params.id } });

    if (!deletedData) {
      res.status(400).json({
        message: 'Error deleting, no data found with the specified ID',
      });
    }
    res.status(200).json(deletedData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
