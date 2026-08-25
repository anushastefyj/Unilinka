export const ACADEMIC_YEARS = [
  { id: 'all', label: 'All Years', value: 'All Years' },
  { id: 'year-1', label: 'Year 1', value: 'Year 1' },
  { id: 'year-2', label: 'Year 2', value: 'Year 2' },
  { id: 'year-3', label: 'Year 3', value: 'Year 3' },
  { id: 'year-4', label: 'Year 4', value: 'Year 4' }
];

export const SUBJECTS_BY_YEAR = {
  'Year 1': [
    'Engineering Mathematics-I',
    'Engineering Physics',
    'Basic Electrical Engineering',
    'Environment & Ecology',
    'Engineering Physics Lab',
    'Basic Electrical Engineering Lab',
    'Workshop Practice',
    'Engineering Mathematics-II',
    'Engineering Chemistry',
    'Programming for Problem Solving',
    'Engineering Mechanics',
    'Engineering Chemistry Lab',
    'Programming Lab',
    'Engineering Graphics & Design'
  ],
  'Year 2': [
    'Discrete Mathematics',
    'Data Structures',
    'Digital Electronics',
    'Computer Organization & Architecture',
    'Data Structures Lab',
    'Digital Electronics Lab',
    'Operating Systems',
    'Design & Analysis of Algorithms',
    'Database Management Systems (DBMS)',
    'Formal Language & Automata Theory',
    'Operating Systems Lab',
    'Algorithms Lab',
    'DBMS Lab'
  ],
  'Year 3': [
    'Computer Networks',
    'Software Engineering',
    'Compiler Design',
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Graphics',
    'AI & ML Lab',
    'Computer Graphics Lab',
    'Cloud Computing',
    'Information Security'
  ],
  'Year 4': [
    'Industrial Training',
    'Major Project Phase-I',
    'Entrepreneurship & Management'
  ]
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
