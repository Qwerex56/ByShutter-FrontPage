import api from "../client";
import type { CreatePortfolioTileRequestDto } from "../dto/portfolioTile/createPortfolioTileRequestDto";

export async function getPortfolioTiles(pageSize: number, page: number) {
    const response = await api.get(`portfolio-tiles/${pageSize}/${page}`);

    return response.data;
}

export async function getPortfolioTile(portfolioTileId: string) {
    const response = await api.get(`portfolio-tiles/${portfolioTileId}`);

    return response.data;
}

export async function createPortfolioTile(data: CreatePortfolioTileRequestDto) {
    const response = await api.post("portfolio-tiles", data);

    return response.data;
}