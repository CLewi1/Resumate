export type Template = {
    id: string;
    name: string;
    latex: string;
};

export const TEMPLATES: Template[] = [
    {
        id: "simple",
        name: "Simple",
        latex: String.raw`\documentclass[11pt, oneside]{article}
\usepackage{geometry}
\geometry{letterpaper}

\title{My Resume}
\author{Your Name}

\begin{document}
\maketitle

\section*{Experience}

\section*{Education}

\section*{Skills}

\end{document}`,
    },
    {
        id: "stylish-cv",
        name: "Stylish CV",
        latex: String.raw`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Stylish Curriculum Vitae
% LaTeX Template
% Version 1.1 (September 10, 2021)
%
% This template originates from:
% https://www.LaTeXTemplates.com
%
% Authors:
% Stefano (https://www.kindoblue.nl)
% Vel (vel@LaTeXTemplates.com)
%
% License:
% CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\documentclass[a4paper, oneside, final]{scrartcl}

\usepackage{scrlayer-scrpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage{tabularx,colortbl}
\usepackage{microtype}
\titleformat{\section}{\large\scshape\raggedright}{}{0em}{}[\titlerule]

\pagestyle{scrheadings}

\addtolength{\voffset}{-0.5in}
\addtolength{\textheight}{3cm}

\newcommand{\gray}{\rowcolor[gray]{.90}}

\renewcommand{\headfont}{\normalfont\rmfamily\scshape}

\cofoot{
\fontsize{12.5}{17}\selectfont

\textls[150]{123 Broadway {\large\textperiodcentered} City {\large\textperiodcentered} Country 12345}\\
{\Large\Letter} \textls[150]{john@smith.com \ {\Large\Telefon} (000) 111-1111}
}

\begin{document}

\begin{center}

{\fontsize{36}{36}\selectfont\scshape\textls[200]{John Smith}}

\vspace{1.5cm}

\section{Objective}

A position in the field of computers with special interests in business applications programming, information processing, and management systems.

\section{Work Experience}

\begin{tabularx}{0.97\linewidth}{>{\raggedleft\scshape}p{2cm}X}
\gray Period & \textbf{March 2012 --- Present}\\
\gray Employer & \textbf{Layer BV} \hfill Amsterdam, The Netherlands\\
\gray Job Title & \textbf{J2EE Analyst programmer}\\
\gray Languages & \textbf{J2EE}\\
       & Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et auctor neque.
\end{tabularx}

\vspace{12pt}

\begin{tabularx}{0.97\linewidth}{>{\raggedleft\scshape}p{2cm}X}
\gray Period & \textbf{March 2009 --- August 2010 (Part Time)}\\
\gray Employer & \textbf{Buy More} \hfill New York, USA\\
\gray Job Title & \textbf{Supermarket Clerk}\\
       & Lorem ipsum dolor sit amet, consectetur adipiscing elit.
\end{tabularx}

\section{Education}

\begin{tabularx}{0.97\linewidth}{>{\raggedleft\scshape}p{2cm}X}
\gray Period & \textbf{January 2011 --- February 2012}\\
\gray Degree & \textbf{Master of Science in Computer Science}\\
\gray Rank & \textbf{First Class Honours}\\
\gray University & \textbf{The University of California} \hfill Los Angeles, USA\\
\end{tabularx}

\vspace{12pt}

\begin{tabularx}{0.97\linewidth}{>{\raggedleft\scshape}p{2cm}X}
\gray Period & \textbf{August 2008 --- September 2010}\\
\gray Degree & \textbf{Bachelor of Science in Computer Science}\\
\gray Rank & \textbf{With Distinction}\\
\gray University & \textbf{New York University} \hfill New York, USA\\
\end{tabularx}

\section{Skills}

\begin{tabular}{ @{} >{\bfseries}l @{\hspace{6ex}} l }
Computer Languages & Prolog, Haskell, AWK, Erlang, Scheme, ML \\
Protocols \& APIs & XML, JSON, SOAP, REST \\
Databases & MySQL, PostgreSQL, Microsoft SQL \\
Tools & SVN, Vim, Emacs
\end{tabular}

\end{center}

\end{document}`,
    },
    {
        id: "software-engineer",
        name: "Software Engineer",
        latex: String.raw`\documentclass[11pt,letterpaper]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{hyperref}
\pagestyle{empty}

\titleformat{\section}{\large\bfseries\uppercase}{}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{10pt}{6pt}
\setlist[itemize]{noitemsep, topsep=2pt, leftmargin=*}

\begin{document}

{\Huge\bfseries Jane Doe}\\[4pt]
\href{mailto:jane@example.com}{jane@example.com}
$\cdot$ (555) 123-4567
$\cdot$ \href{https://linkedin.com/in/janedoe}{linkedin.com/in/janedoe}
$\cdot$ \href{https://github.com/janedoe}{github.com/janedoe}

\section{Experience}

\textbf{Senior Software Engineer} \hfill Jan 2022 -- Present\\
\textit{Acme Corp} \hfill San Francisco, CA
\begin{itemize}
  \item Built distributed microservices handling 10M requests/day using Go and Kubernetes
  \item Led a team of 5 engineers, delivering two major product features on schedule
  \item Reduced p99 API latency by 35\% through query optimization and caching
\end{itemize}

\medskip
\textbf{Software Engineer} \hfill Jun 2019 -- Dec 2021\\
\textit{Startup Inc} \hfill New York, NY
\begin{itemize}
  \item Developed full-stack web application (React + Node.js) serving 50k monthly users
  \item Automated CI/CD pipeline, cutting deploy time from 45 min to 8 min
\end{itemize}

\section{Education}

\textbf{B.S. Computer Science} \hfill May 2019\\
\textit{State University} \hfill Anytown, USA\\
GPA: 3.8/4.0 $\cdot$ Dean's List

\section{Skills}

\textbf{Languages:} JavaScript, TypeScript, Python, Go, SQL\\
\textbf{Technologies:} React, Node.js, PostgreSQL, Redis, Docker, Kubernetes, AWS\\
\textbf{Tools:} Git, GitHub Actions, Terraform, Datadog

\end{document}`,
    },
];
