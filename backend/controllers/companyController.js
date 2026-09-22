import Company from '../models/Company.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    
    // Attach isFollowing for the current user
    const result = companies.map(company => ({
      ...company.toObject(),
      isFollowing: company.followers.some((id) => id.toString() === req.user._id.toString()),
      followersCount: company.followers.length,
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json({
      ...company.toObject(),
      isFollowing: company.followers.some((id) => id.toString() === req.user._id.toString()),
      followersCount: company.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow / Unfollow company
// @route   POST /api/companies/:id/follow
// @access  Private
export const toggleFollowCompany = async (req, res) => {
  try {
    if (req.user.role === 'guest') {
      return res.status(403).json({ message: 'Guest users cannot follow companies.' });
    }

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const isFollowing = company.followers.some((id) => id.toString() === req.user._id.toString());

    if (isFollowing) {
      company.followers.pull(req.user._id);
    } else {
      company.followers.addToSet(req.user._id);
    }

    await company.save();

    res.json({
      success: true,
      isFollowing: !isFollowing,
      followersCount: company.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
