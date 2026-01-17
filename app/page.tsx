"use client";

import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



export default function Home() {

    const [latex, setLatex] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [template, setTemplate] = useState("stylishCV");

    const defaultTemplate = `\\documentclass[11pt, oneside]{article} 
\\usepackage{geometry}                	
\\geometry{letterpaper}
								

	
\\usepackage{amssymb}
%SetFonts

%SetFonts


\\title{Brief Article}
\\author{The Author}
%\\date{}							% Activate to display a given date or no date

\\begin{document}
\\maketitle
%\\section{}
%\\subsection{}



    \\end{document}  `;

    const stylishCV = `%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

    \\documentclass[a4paper, oneside, final]{scrartcl} % Paper options using the scrartcl class

    \\usepackage{scrlayer-scrpage} % Provides headers and footers configuration
    \\usepackage{titlesec} % Allows creating custom \section's
    \\usepackage{marvosym} % Allows the use of symbols
    \\usepackage{tabularx,colortbl} % Advanced table configurations
    \\usepackage{microtype} % To enable letterspacing
    \\titleformat{\\section}{\\large\\scshape\\raggedright}{}{0em}{}[\\titlerule] % Section formatting

    \\pagestyle{scrheadings} % Print the headers and footers on all pages

    \\addtolength{\\voffset}{-0.5in} % Adjust the vertical offset - less whitespace at the top of the page
    \\addtolength{\\textheight}{3cm} % Adjust the text height - less whitespace at the bottom of the page

    \\newcommand{\\gray}{\\rowcolor[gray]{.90}} % Custom highlighting for the work experience and education sections

    %----------------------------------------------------------------------------------------
    %	FOOTER SECTION
    %----------------------------------------------------------------------------------------

    \\renewcommand{\\headfont}{\\normalfont\\rmfamily\\scshape} % Font settings for footer

    \\cofoot{
    \\fontsize{12.5}{17}\\selectfont % Letter spacing and font size

    \\textls[150]{123 Broadway {\\large\\textperiodcentered} City {\\large\\textperiodcentered} Country 12345}\\\\ % Your mailing address
    {\\Large\\Letter} \\textls[150]{john@smith.com \\ {\\Large\\Telefon} (000) 111-1111} % Your email address and phone number
    }

    %----------------------------------------------------------------------------------------

    \\begin{document}

    \\begin{center} % Center everything in the document

    %----------------------------------------------------------------------------------------
    %	HEADER SECTION
    %----------------------------------------------------------------------------------------

    {\\fontsize{36}{36}\\selectfont\\scshape\\textls[200]{John Smith}} % Your name at the top

    \\vspace{1.5cm} % Extra whitespace after the large name at the top

    %----------------------------------------------------------------------------------------
    %	OBJECTIVE
    %----------------------------------------------------------------------------------------

    \\section{Objective}

    A position in the field of computers with special interests in business applications \\ programming, information processing, and management systems.

    %----------------------------------------------------------------------------------------
    %	WORK EXPERIENCE
    %----------------------------------------------------------------------------------------

    \\section{Work Experience}

    \\begin{tabularx}{0.97\\linewidth}{>{\\raggedleft\\scshape}p{2cm}X}
    \\gray Period & \\textbf{March 2012 --- Present}\\\\
    \\gray Employer & \\textbf{Layer BV} \\hfill Amsterdam, The Netherlands\\\\
    \\gray Job Title & \\textbf{J2EE Analyst programmer}\\\\
    \\gray Languages & \\textbf{J2EE}\\\\
           & Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et auctor neque. Nullam ultricies sem sit amet magna tristique imperdiet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus eget mollis nunc.
    \\end{tabularx}

    \\vspace{12pt}

    \\begin{tabularx}{0.97\\linewidth}{>{\\raggedleft\\scshape}p{2cm}X}
    \\gray Period & \\textbf{March 2009 --- August 2010 (Part Time)}\\\\
    \\gray Employer & \\textbf{Buy More} \\hfill New York, USA\\\\
    \\gray Job Title & \\textbf{Supermarket Clerk}\\\\
           & Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et auctor neque. Nullam ultricies sem sit amet magna tristique imperdiet.
    \\end{tabularx}

    %----------------------------------------------------------------------------------------
    %	EDUCATION
    %----------------------------------------------------------------------------------------

    \\section{Education}

    \\begin{tabularx}{0.97\\linewidth}{>{\\raggedleft\\scshape}p{2cm}X}
    \\gray Period & \\textbf{January 2011 --- February 2012}\\\\
    \\gray Degree & \\textbf{Master of Science in Computer Science}\\\\
    \\gray Rank & \\textbf{First Class Honours}\\\\
    \\gray University & \\textbf{The University of California} \\hfill Los Angeles, USA\\\\
    %& Extra information about degree
    \\end{tabularx}

    \\vspace{12pt}

    \\begin{tabularx}{0.97\\linewidth}{>{\\raggedleft\\scshape}p{2cm}X}
    \\gray Period & \\textbf{August 2008 --- September 2010}\\\\
    \\gray Degree & \\textbf{Bachelor of Science in Computer Science}\\\\
    \\gray Rank & \\textbf{With Distinction}\\\\
    \\gray University & \\textbf{New York University} \\hfill New York, USA\\\\
    %& Extra information about degree
    \\end{tabularx}

    %----------------------------------------------------------------------------------------
    %	SKILLS
    %----------------------------------------------------------------------------------------

    \\section{Skills}

    \\begin{tabular}{ @{} >{\\bfseries}l @{\\hspace{6ex}} l }
    Computer Languages & Prolog, Haskell, AWK, Erlang, Scheme, ML \\\\
    Protocols \\& APIs & XML, JSON, SOAP, REST \\\\
    Databases & MySQL, PostgreSQL, Microsoft SQL \\\\
    Tools & SVN, Vim, Emacs
    \\end{tabular}

    %----------------------------------------------------------------------------------------

    \\end{center}

    \\end{document}`

    const mediumProfessional = ``;

    function handleTemplateChange(value: string) {
        setTemplate(value);
        if (value === "default") {
            setLatex(defaultTemplate);
        } else if (value === "stylishCV") {
            setLatex(stylishCV);
        }
    }

    async function handleLatexSubmit() {
        setIsLoading(true);

        // Call internal API with LaTeX content
        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latex })
        })

        // Finished loading
        setIsLoading(false);

        if (response.ok) {
            // If successful, get pdf blob
            const data = await response.blob();
            console.log("Recieved PDF Blob:", data);

            const url = URL.createObjectURL(data);
            setPdfUrl(url);
            
        } else {
            const errorData = await response.json();
            console.error("Error", errorData);
        }
    }

    useEffect(() => { 
        // Cleanup the URL object when component unmounts or pdfUrl changes
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);




    return (
        <div className="screen bg-zinc-50 font-sans dark:bg-black">
                <ResizablePanelGroup orientation="horizontal" className="h-screen w-full bg-gray-700">
                    <ResizablePanel>
                        <h1 className="text-white">Random text</h1>
                            <Select onValueChange={handleTemplateChange}>
                                <SelectTrigger className="w-45">
                                    <SelectValue placeholder="Select a Template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Templates</SelectLabel>
                                    <SelectItem value="default" >Default Template</SelectItem>
                                    <SelectItem value="stylishCV">Stylish CV</SelectItem>
                                    <SelectItem value="mediumProfessional"> Medium Length Professional</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        <Textarea 
                            className="text-white w-full h-100" 
                            placeholder="Type your message here." 
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                        />
                        <Button 
                            className="mt-4" 
                            onClick={handleLatexSubmit}
                            disabled={isLoading}>
                                {isLoading ? 'Generating PDF...' : 'Submit'}
                        </Button>
                    </ResizablePanel>

                    <ResizableHandle withHandle={true} />
                    
                    <ResizablePanel>

                        <iframe src={pdfUrl ?? undefined} className={'w-full h-full'}/>
                    </ResizablePanel>
                </ResizablePanelGroup>
                

        </div>
    );
}
