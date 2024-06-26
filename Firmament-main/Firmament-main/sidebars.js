/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  //tutorialSidebar: [{type: 'autogenerated', id: '.'}],

  // But you can create a sidebar manually
  
  appSidebar: [
    {
      type: 'category',
      label: 'Firebase',
      items: [
        {
          type: 'doc',
          id: 'Firebase/Display',
          label:'Display',
        },
        {
          type: 'doc',
          id: 'Firebase/Submit',
          label:'Submit',
        },
        {
          type: 'doc',
          id: 'Firebase/DisplayFirestore',
          label:'DisplayFirestore',
        },
        {
          type: 'doc',
          id: 'Firebase/SubmitFirestore',
          label:'SubmitFirestore',
        },
      ],
    },
    {
      type: 'category',
      label: 'NewsViz',
      items: [
        {
          type: 'doc',
          id: 'NewsViz/Scrape',
          label:'Scrape',
        },
        {
          type: 'doc',
          id: 'NewsViz/SearchNews',
          label:'SearchNews',
        },
        {
          type: 'doc',
          id: 'NewsViz/SentimentNews',
          label:'SentimentNews',
        },
        {
          type: 'doc',
          id: 'NewsViz/SphereNews',
          label:'SphereNews',
        },
      ],
    },
    {
      type: 'category',
      label: 'Games',
      items: [
        {
          type: 'doc',
          id: 'Games/TicTacToe',
          label:'TicTacToe',
        },
        {
          type: 'doc',
          id: 'Games/Gomoku',
          label:'Gomoku',
        },
        {
          type: 'doc',
          id: 'Games/GomokuNetPlay',
          label:'GomokuNetPlay',
        },
      ],
    },
    {
      type: 'category',
      label: 'Stella',
      items: [
        {
          type: 'doc',
          id: 'Stella/Chatbot',
          label:'Chatbot',
        },
      ],
    },
  ],
};

module.exports = sidebars;
