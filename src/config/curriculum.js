export const ACADEMIC_YEARS = [
  { id: 'all', label: 'All Years', value: 'All Years' },
  { id: 'year-1', label: 'Year 1', value: 'Year 1' },
  { id: 'year-2', label: 'Year 2', value: 'Year 2' },
  { id: 'year-3', label: 'Year 3', value: 'Year 3' },
  { id: 'year-4', label: 'Year 4', value: 'Year 4' }
];

export const BRANCHES = [
  { id: 'cse', label: 'Computer Science (CSE)', value: 'CSE' },
  { id: 'ece', label: 'Electronics & Comm (ECE)', value: 'ECE' },
  { id: 'me', label: 'Mechanical Eng (ME)', value: 'ME' },
  { id: 'ce', label: 'Civil Eng (CE)', value: 'CE' }
];

export const SEMESTERS = [
  { id: 'sem-1', label: 'Semester 1', value: 'Semester 1' },
  { id: 'sem-2', label: 'Semester 2', value: 'Semester 2' }
];

// Hierarchical Curriculum Data Structure:
// Year -> Branch -> Semester -> [Subjects]
export const HIERARCHICAL_CURRICULUM = {
  'Year 1': {
    'CSE': {
      'Semester 1': [
        'Engineering Mathematics-I',
        'Engineering Physics',
        'Basic Electrical Engineering',
        'Engineering Physics Lab',
        'Basic Electrical Engineering Lab'
      ],
      'Semester 2': [
        'Engineering Mathematics-II',
        'Engineering Chemistry',
        'Programming for Problem Solving',
        'Engineering Mechanics',
        'Programming Lab',
        'Engineering Graphics & Design'
      ]
    },
    'ECE': {
      'Semester 1': ['Engineering Mathematics-I', 'Engineering Physics', 'Basic Electrical Engineering'],
      'Semester 2': ['Engineering Mathematics-II', 'Engineering Chemistry', 'Programming for Problem Solving']
    },
    'ME': {
      'Semester 1': ['Engineering Mathematics-I', 'Engineering Physics', 'Engineering Mechanics'],
      'Semester 2': ['Engineering Mathematics-II', 'Engineering Chemistry', 'Engineering Graphics & Design']
    },
    'CE': {
      'Semester 1': ['Engineering Mathematics-I', 'Engineering Physics', 'Environment & Ecology'],
      'Semester 2': ['Engineering Mathematics-II', 'Engineering Chemistry', 'Engineering Mechanics']
    }
  },
  'Year 2': {
    'CSE': {
      'Semester 1': [
        'Discrete Mathematics',
        'Data Structures',
        'Digital Electronics',
        'Data Structures Lab',
        'Digital Electronics Lab'
      ],
      'Semester 2': [
        'Computer Organization & Architecture',
        'Operating Systems',
        'Design & Analysis of Algorithms',
        'Database Management Systems (DBMS)',
        'Operating Systems Lab',
        'DBMS Lab'
      ]
    },
    'ECE': {
      'Semester 1': ['Analog Circuits', 'Signals and Systems', 'Network Theory'],
      'Semester 2': ['Microprocessors', 'Control Systems', 'Digital Signal Processing']
    },
    'ME': {
      'Semester 1': ['Thermodynamics', 'Fluid Mechanics', 'Material Science'],
      'Semester 2': ['Kinematics of Machinery', 'Applied Thermodynamics', 'Manufacturing Processes']
    },
    'CE': {
      'Semester 1': ['Solid Mechanics', 'Surveying', 'Fluid Mechanics'],
      'Semester 2': ['Structural Analysis', 'Geotechnical Engineering', 'Environmental Engineering']
    }
  },
  'Year 3': {
    'CSE': {
      'Semester 1': [
        'Computer Networks',
        'Software Engineering',
        'Compiler Design',
        'Formal Language & Automata Theory'
      ],
      'Semester 2': [
        'Artificial Intelligence',
        'Machine Learning',
        'Computer Graphics',
        'AI & ML Lab',
        'Cloud Computing'
      ]
    },
    'ECE': {
      'Semester 1': ['Electromagnetic Waves', 'Computer Architecture', 'Digital Communication'],
      'Semester 2': ['VLSI Design', 'Antennas and Propagation', 'Information Theory']
    },
    'ME': {
      'Semester 1': ['Dynamics of Machinery', 'Heat Transfer', 'Design of Machine Elements I'],
      'Semester 2': ['Design of Machine Elements II', 'Operations Research', 'CAD/CAM']
    },
    'CE': {
      'Semester 1': ['Design of Concrete Structures', 'Transportation Engineering', 'Hydrology'],
      'Semester 2': ['Design of Steel Structures', 'Construction Management', 'Foundation Engineering']
    }
  },
  'Year 4': {
    'CSE': {
      'Semester 1': [
        'Information Security',
        'Data Mining',
        'Industrial Training'
      ],
      'Semester 2': [
        'Major Project Phase-I',
        'Entrepreneurship & Management'
      ]
    },
    'ECE': {
      'Semester 1': ['Wireless Communication', 'Optical Networks', 'Industrial Training'],
      'Semester 2': ['Major Project Phase-I', 'Entrepreneurship & Management']
    },
    'ME': {
      'Semester 1': ['Automobile Engineering', 'Power Plant Engineering', 'Industrial Training'],
      'Semester 2': ['Major Project Phase-I', 'Entrepreneurship & Management']
    },
    'CE': {
      'Semester 1': ['Estimation and Costing', 'Bridge Engineering', 'Industrial Training'],
      'Semester 2': ['Major Project Phase-I', 'Entrepreneurship & Management']
    }
  }
};

// Maintained for backward compatibility for parts of the app not yet migrated
export const SUBJECTS_BY_YEAR = {
  'Year 1': [...HIERARCHICAL_CURRICULUM['Year 1']['CSE']['Semester 1'], ...HIERARCHICAL_CURRICULUM['Year 1']['CSE']['Semester 2']],
  'Year 2': [...HIERARCHICAL_CURRICULUM['Year 2']['CSE']['Semester 1'], ...HIERARCHICAL_CURRICULUM['Year 2']['CSE']['Semester 2']],
  'Year 3': [...HIERARCHICAL_CURRICULUM['Year 3']['CSE']['Semester 1'], ...HIERARCHICAL_CURRICULUM['Year 3']['CSE']['Semester 2']],
  'Year 4': [...HIERARCHICAL_CURRICULUM['Year 4']['CSE']['Semester 1'], ...HIERARCHICAL_CURRICULUM['Year 4']['CSE']['Semester 2']],
};

// Helper function to get all flat subjects across years (useful for "All Years" filter)
export const getAllSubjects = () => {
  return [
    ...SUBJECTS_BY_YEAR['Year 1'],
    ...SUBJECTS_BY_YEAR['Year 2'],
    ...SUBJECTS_BY_YEAR['Year 3'],
    ...SUBJECTS_BY_YEAR['Year 4']
  ];
};

// Admin-side mapping for Common Subject Merge
// This maps a shared subject name to all the specific branch-siloed names that should be merged.
export const COMMON_SUBJECT_MAPPINGS = {
  'Engineering Mathematics-I': ['Engineering Mathematics-I', 'Mathematics I (CSE)', 'Mathematics I (ECE)'],
  'Engineering Mathematics-II': ['Engineering Mathematics-II', 'Mathematics II (CSE)', 'Mathematics II (ECE)'],
  'Engineering Physics': ['Engineering Physics', 'Physics (CSE)', 'Physics (ECE)'],
  'Engineering Chemistry': ['Engineering Chemistry', 'Chemistry (CSE)', 'Chemistry (ECE)'],
  'Basic Electrical Engineering': ['Basic Electrical Engineering', 'BEE (CSE)', 'BEE (ECE)'],
  'Programming for Problem Solving': ['Programming for Problem Solving', 'PPS (CSE)', 'PPS (ECE)']
};

// Helper function to return the array of subjects to query for, supporting merged subjects
export const getSubjectQueryList = (subjectName) => {
  if (COMMON_SUBJECT_MAPPINGS[subjectName]) {
    return COMMON_SUBJECT_MAPPINGS[subjectName];
  }
  return [subjectName];
};
