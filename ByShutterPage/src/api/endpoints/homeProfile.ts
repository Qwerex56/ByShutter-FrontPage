import api from "../client";
import type { CreateHomeProfileRequestDto } from "../dto/homeProfile/createHomeProfileRequestDto";

export async function getHomeProfile(homeProfileId: string) {
    const response = await api.get(`home-profile/${homeProfileId}`);

    return response.data;
}

export async function getHeroSection(homeProfileId: string) {
    const response = await api.get(`home-profile/${homeProfileId}/hero-section`);

    return response.data;
}

export async function getAboutMeSection(homeProfileId: string) {
    const response = await api.get(`home-profile/${homeProfileId}/about-me-section`);

    return response.data;
}

export async function getHomeImages(homeProfileId: string) {
    const response = await api.get(`home-profile/${homeProfileId}/home-images`);

    return response.data;
}

export async function createHomeProfile(data: CreateHomeProfileRequestDto) {
    const response = await api.post("home-profile", data);

    return response.data;
}

export async function updatePortfolioTile(homeProfileId: string, portfolioTileId: string) {
    const response = await api.put(`home-profile/${homeProfileId}/portfolio-tiles/${portfolioTileId}`);

    return response.data;
}