insert into public.module_categories (name) values
  ('General'),
  ('Freshman Module'),
  ('Orientation'),
  ('Immersion 1'),
  ('Immersion 2'),
  ('Focus');

insert into public.modules (title, division, faculty, description, form_link, category_id)
select v.title, v.division, v.faculty, v.description, v.form_link, c.id
from (values
  ('Academic Writing', 'Skill Development', 'various', '', '', 'General'),
  ('Magic in the Making', 'Arts and Humanities: Applied Aesthetics', 'Dúcz Erzsébet', '', '', 'Freshman Module'),
  ('Ventures', 'Social Sciences: Regions, Development, Enterprise', 'Zekov Szófia', '', '', 'Freshman Module'),
  ('Engineering Lab: 3D Printing', 'Numerical Sciences: Physics and Engineering', 'Husam Kareem', '', 'https://forms.gle/JfjGVyxEz6xr4YC99', 'Orientation'),
  ('Evolution', 'Natural Sciences: Life Sciences', 'Boros Gergely', 'Core for Veterinary Science, Anthropology', 'https://forms.gle/qKnZ6Q4bgHs8uQxL7', 'Orientation'),
  ('Forensic Science', 'Natural Sciences: Chemical, Material and Earth Sciences', 'Rézműves Zoltán, Boros Gergely', '', 'https://forms.gle/UN9gLhYDuxTPsV9n9', 'Orientation'),
  ('Global Challenges', 'Numerical Sciences: Physics and Engineering', 'Verebes-Szász Edit', 'Core for Business and Management', 'https://forms.gle/qyYgYYcumcEYMsov6', 'Orientation'),
  ('Good and Evil', 'Arts and Humanities: Law and Humanities', 'Sárosi András', 'Core for Theology', 'https://forms.gle/EUyASR6PMeX7iqXs6', 'Orientation'),
  ('Human Nature', 'Natural Sciences: Thought, Language, Behaviour', 'Markó Gitta', 'Core for Psychology, Social Anthropology', 'https://forms.gle/2bQKY2CYJp24pREb7', 'Orientation'),
  ('Posters for Change', 'Arts and Humanities: Applied Aesthetics', 'Máté Dániel', 'Core for Design, Animation and Fine Art', 'https://forms.gle/fG8893iAWFNQ1iMV8', 'Orientation'),
  ('Introduction to Programming', 'Numerical Sciences: Mathematics and Its Applications', 'Saleem Mohammad', 'Core for Computer Science', 'https://forms.gle/mZ5sMBmEDNtCZ4MTA', 'Orientation'),
  ('World Politics and Area Studies: The Middle East', 'Social Sciences: Regions, Development, Enterprise', 'Akin Erdost', 'Core for Area Studies and Languages, International Relations', 'https://forms.gle/dNq8VczZqKZV4SPM6', 'Immersion 1'),
  ('Diagnosis', 'Natural Sciences: Life Sciences', 'Vig Julianna', 'Core for Biology, Medicine, Veterinary Science', 'https://forms.gle/LUzA3TCgC8YNtQkUA', 'Immersion 1'),
  ('Differentiation', 'Numerical Sciences: Mathematics and Its Applications', 'Szabó Dávid', 'Core for Computer Science, Economics, Mathematics, Engineering, Physics', 'https://forms.gle/AaKR2hxcfzdsygas5', 'Immersion 1'),
  ('Pop vs Culture', 'Arts and Humanities: Applied Aesthetics', 'Szentpály Dalma', 'Core for Music, Literary Studies, Film Studies, Art Management, Animation and Fine Art, Cultural Studies', 'https://forms.gle/GYnLSJbaV3SZj3qV6', 'Immersion 1'),
  ('Quantitative Research Methods', 'Natural Sciences: Thought, Language, Behaviour', 'Sopronyi Gréta', 'Core for Linguistics, Psychology, Sociology', 'https://forms.gle/f2PsCyaiXFtHWhGb6', 'Immersion 1'),
  ('Sociological Perspectives', 'Social Sciences: Politics, Society, Culture', 'Jakab Eszter', 'Core for Politics, Sociology, Cultural Studies', 'https://forms.gle/1GoLZop9qj6x3HpL6', 'Immersion 1'),
  ('Biomedical Ethics', 'Natural Sciences: Thought, Language, Behaviour', 'Varjú Márton', 'Core for Philosophy', 'https://forms.gle/kqfK5x95UWtjz2mW8', 'Immersion 2'),
  ('Historiography', 'Arts and Humanities: Past, Narrative, Interpretation', 'Hutvágner Zsófia', 'Core for Archaeology, History, Area Studies and Languages', 'https://forms.gle/H56kqFfNxrjbduxeA', 'Immersion 2'),
  ('Mechanics', 'Numerical Sciences: Physics and Engineering', 'Hetényi Balázs', 'Core for Engineering, Physics, Materials Science', 'https://forms.gle/8hCxdH9p2a762c716', 'Immersion 2'),
  ('Probability', 'Numerical Sciences: Mathematics and Its Applications', 'Mavroyiannis Diomides', 'Core for Economics', 'https://forms.gle/byAGcpqy6b3i4qm89', 'Immersion 2'),
  ('State Theory', 'Social Sciences: Politics, Society, Culture', 'Hayes Lukács Dániel', 'Core for Politics', 'https://forms.gle/D8vmLFqqXBNLDQZp8', 'Immersion 2'),
  ('Energy', 'Social Sciences: Regions, Development, Enterprise', 'Dürr Miklós János', 'Core for International Relations, Land Economy and Development Studies, Geography, Business and Management', 'https://forms.gle/jPZfCbMvf4JyZxtS7', 'Focus')
) v(title, division, faculty, description, form_link, category)
join public.module_categories c on c.name = v.category;
