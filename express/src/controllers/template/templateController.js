const prisma = require("../../config/prisma");

exports.getAll = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.template.count({ where }),
    ]);

    res.json({
      templates,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const template = await prisma.template.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!template) return res.status(404).json({ message: "Not found" });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, data } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const template = await prisma.template.create({
      data: { name, description, data: data || {} },
    });
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, data, isActive } = req.body;
    const template = await prisma.template.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, data, isActive },
    });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.template.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.activate = async (req, res) => {
  try {
    // Deactivate all first
    await prisma.template.updateMany({ data: { isActive: false } });

    // Activate the selected one
    const template = await prisma.template.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: true },
    });

    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActive = async (req, res) => {
  try {
    const template = await prisma.template.findFirst({
      where: { isActive: true },
    });
    if (!template)
      return res.status(404).json({ message: "No active template" });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
