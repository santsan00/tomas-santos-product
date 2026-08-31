/**
 * Figma API Client
 * Handles all communication with the Figma REST API
 */

const axios = require('axios');

const FIGMA_API_BASE = 'https://api.figma.com/v1';

class FigmaClient {
  constructor() {
    this.token = process.env.FIGMA_API_TOKEN;
    this.fileId = process.env.FIGMA_FILE_ID;
    this.nodeId = process.env.FIGMA_NODE_ID || null;

    if (!this.token) {
      throw new Error('FIGMA_API_TOKEN is required');
    }
    if (!this.fileId) {
      throw new Error('FIGMA_FILE_ID is required');
    }
  }

  /**
   * Get the main file data
   */
  async getFile() {
    const url = `${FIGMA_API_BASE}/files/${this.fileId}`;
    if (this.nodeId) {
      url += `?node_ids=${this.nodeId}`;
    }

    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': this.token
      }
    });

    return response.data;
  }

  /**
   * Get file nodes (for specific nodes)
   */
  async getFileNodes(nodeIds) {
    const url = `${FIGMA_API_BASE}/files/${this.fileId}/nodes?ids=${nodeIds.join(',')}`;

    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': this.token
      }
    });

    return response.data;
  }

  /**
   * Get images from Figma
   */
  async getImages(nodeIds, format = 'png', scale = 1) {
    const url = `${FIGMA_API_BASE}/images/${this.fileId}`;

    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': this.token
      },
      params: {
        ids: nodeIds.join(','),
        format,
        scale
      }
    });

    return response.data;
  }

  /**
   * Get file styles (colors, text styles, etc.)
   */
  async getStyles() {
    const url = `${FIGMA_API_BASE}/files/${this.fileId}/styles`;

    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': this.token
      }
    });

    return response.data;
  }

  /**
   * Get components from the file
   */
  async getComponents() {
    const url = `${FIGMA_API_BASE}/files/${this.fileId}/components`;

    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': this.token
      }
    });

    return response.data;
  }

  /**
   * Get component sets
   */
  async getComponentSets() {
    const url = `${FIGMA_API_BASE}/files/${this.fileId}/component_sets`;

    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': this.token
      }
    });

    return response.data;
  }
}

module.exports = { FigmaClient };
