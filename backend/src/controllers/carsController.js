const pool = require('../db');

const ALLOWED_COLUMNS = [
  'id',
  'Brand',
  'Model',
  'AccelSec',
  'TopSpeed_KmH',
  'Range_Km',
  'Efficiency_WhKm',
  'FastCharge_KmH',
  'RapidCharge',
  'PowerTrain',
  'PlugType',
  'BodyStyle',
  'Segment',
  'Seats',
  'PriceEuro',
  'Date',
];

function buildFilterClause(filtersObj, params) {
  const clauses = [];

  Object.entries(filtersObj || {}).forEach(([column, filter]) => {
    if (!ALLOWED_COLUMNS.includes(column)) return;

    if (!filter) return;
    const { operator, value } = filter;
    const col = column;
    if (operator === 'isEmpty') {
      clauses.push(`(${col} IS NULL OR ${col} = '')`);
      return;
    }
    if (value === undefined || value === null || value === '') return;

    const val = String(value);

    switch (operator) {
      case 'contains':
        clauses.push(`${col} LIKE ?`);
        params.push(`%${val}%`);
        break;
      case 'equals':
        clauses.push(`${col} = ?`);
        params.push(val);
        break;
      case 'startsWith':
        clauses.push(`${col} LIKE ?`);
        params.push(`${val}%`);
        break;
      case 'endsWith':
        clauses.push(`${col} LIKE ?`);
        params.push(`%${val}`);
        break;
      case 'greaterThan':
        clauses.push(`${col} > ?`);
        params.push(val);
        break;
      case 'lessThan':
        clauses.push(`${col} < ?`);
        params.push(val);
        break;
      default:
        break;
    }
  });

  return clauses;
}

const listCars = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 20,
      search = '',
      sortField = 'id',
      sortOrder = 'asc',
      filters = '{}',
    } = req.query;

    const offset = (Number(page) - 1) * Number(pageSize);
    let filtersObj = {};
    try {
      filtersObj = JSON.parse(filters);
    } catch (e) {
      filtersObj = {};
    }

    const whereParts = [];
    const params = [];
    if (search) {
      const like = `%${search}%`;
      whereParts.push(
        '(Brand LIKE ? OR Model LIKE ? OR BodyStyle LIKE ? OR PlugType LIKE ? OR PowerTrain LIKE ?)'
      );
      params.push(like, like, like, like, like);
    }
    const filterClauses = buildFilterClause(filtersObj, params);
    if (filterClauses.length) {
      whereParts.push(filterClauses.join(' AND '));
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';
    const sortCol = ALLOWED_COLUMNS.includes(sortField) ? sortField : 'id';
    const validSortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const [rows] = await pool.query(
      `SELECT * FROM cars ${whereClause} ORDER BY ${sortCol} ${validSortOrder} LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), Number(offset)]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM cars ${whereClause}`,
      params
    );

    res.json({
      data: rows,
      total: countResult[0].total,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching cars' });
  }
};

const getCarById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cars WHERE id = ?', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching car' });
  }
};

const deleteCar = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM cars WHERE id = ?', [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting car' });
  }
};

module.exports = {
  listCars,
  getCarById,
  deleteCar,
};
