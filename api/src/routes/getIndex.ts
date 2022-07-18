import express from 'express'
import { logger } from '../services'

export const getIndexHandler = async (
      _req: express.Request,
      res: express.Response
) => {
      try {
            res.status(200).json({
                  ok: true,
                  serviceName: '[drift-discord:api]',
                  version: '1',
                  message: 'online',
            })
      } catch (error) {
            res.status(500).json({
                  ok: false,
                  serviceName: '[drift-discord:api]',
                  version: '1',
                  message: 'offline',
                  error: error.message,
            })
      }
}
